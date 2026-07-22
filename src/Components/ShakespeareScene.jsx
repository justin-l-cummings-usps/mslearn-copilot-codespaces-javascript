/**
 * ShakespeareScene component
 *
 * Renders a randomized stick-figure tableau inspired by Shakespearean stage scenes.
 * The layout is intentionally re-rolled on each page load.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

const SCENES = [
  {
    title: "Balcony Scene",
    subtitle: "A moonlit exchange",
    sky: ["#0f1630", "#24325b", "#6d7dd8"],
    light: "#ffe8b4",
    curtain: "#6d1732",
    floor: "#181325",
    figures: [
      { x: 18, y: 70, scale: 1.15, pose: "reach", color: "#f8f0ff", prop: "rose" },
      { x: 58, y: 77, scale: 1, pose: "whisper", color: "#f3d6b6", prop: "balcony" },
      { x: 81, y: 68, scale: 0.9, pose: "watch", color: "#e9d9ff", prop: "none" },
    ],
  },
  {
    title: "Swordplay",
    subtitle: "Two rivals on the brink",
    sky: ["#0d1021", "#25304f", "#4f5f88"],
    light: "#f8d28a",
    curtain: "#7c2135",
    floor: "#130f1c",
    figures: [
      { x: 24, y: 73, scale: 1.05, pose: "duel", color: "#f9efe8", prop: "sword" },
      { x: 74, y: 72, scale: 1.05, pose: "duel", color: "#f1d7ff", prop: "sword" },
      { x: 49, y: 66, scale: 0.85, pose: "watch", color: "#d9f0ff", prop: "none" },
    ],
  },
  {
    title: "Soliloquy",
    subtitle: "One voice, one spotlight",
    sky: ["#120f23", "#35274f", "#7d5d7b"],
    light: "#fff0c4",
    curtain: "#5d1a2e",
    floor: "#17111f",
    figures: [
      { x: 50, y: 73, scale: 1.18, pose: "think", color: "#fff0d7", prop: "dagger" },
      { x: 28, y: 80, scale: 0.82, pose: "watch", color: "#e5ddff", prop: "none" },
      { x: 72, y: 80, scale: 0.82, pose: "watch", color: "#e5ddff", prop: "none" },
    ],
  },
  {
    title: "Crown and Consequence",
    subtitle: "A throne room in tension",
    sky: ["#10243b", "#274b67", "#9a6d54"],
    light: "#ffd98d",
    curtain: "#8a2436",
    floor: "#171a24",
    figures: [
      { x: 46, y: 68, scale: 1.14, pose: "crown", color: "#fff3de", prop: "crown" },
      { x: 28, y: 79, scale: 0.95, pose: "kneel", color: "#dfe8ff", prop: "scroll" },
      { x: 76, y: 75, scale: 0.98, pose: "watch", color: "#f2d7ff", prop: "torch" },
    ],
  },
  {
    title: "Parting Words",
    subtitle: "A farewell at the gate",
    sky: ["#1c2242", "#3d5979", "#d18c6f"],
    light: "#ffe3b1",
    curtain: "#6f1d34",
    floor: "#1b1320",
    figures: [
      { x: 20, y: 76, scale: 1, pose: "wave", color: "#fdebd5", prop: "lantern" },
      { x: 50, y: 70, scale: 1.12, pose: "reach", color: "#e8e6ff", prop: "letter" },
      { x: 79, y: 77, scale: 0.92, pose: "watch", color: "#d9f5ef", prop: "none" },
    ],
  },
  {
    title: "Storm on the Heath",
    subtitle: "Wind, thunder, resolve",
    sky: ["#101729", "#294363", "#5f7f9a"],
    light: "#cde4ff",
    curtain: "#5b1e32",
    floor: "#151821",
    figures: [
      { x: 22, y: 74, scale: 1.08, pose: "wave", color: "#e6ecff", prop: "torch" },
      { x: 52, y: 72, scale: 1.04, pose: "think", color: "#f6e3ce", prop: "dagger" },
      { x: 80, y: 76, scale: 0.96, pose: "watch", color: "#d4f1ff", prop: "none" },
    ],
  },
  {
    title: "Mischief at Midnight",
    subtitle: "Masks and mistaken hearts",
    sky: ["#181b38", "#3f3c6f", "#7d5f8f"],
    light: "#ffe0b2",
    curtain: "#6d1f3b",
    floor: "#1c1425",
    figures: [
      { x: 24, y: 76, scale: 1.02, pose: "whisper", color: "#f8dfc5", prop: "letter" },
      { x: 54, y: 70, scale: 1.12, pose: "reach", color: "#ece6ff", prop: "rose" },
      { x: 82, y: 77, scale: 0.93, pose: "wave", color: "#d7f3ea", prop: "lantern" },
    ],
  },
  {
    title: "Trial by Rumor",
    subtitle: "Witnesses in shadows",
    sky: ["#101a2b", "#27455c", "#5f747e"],
    light: "#ffe3a6",
    curtain: "#7a2637",
    floor: "#151b23",
    figures: [
      { x: 26, y: 78, scale: 0.95, pose: "kneel", color: "#d9e8ff", prop: "scroll" },
      { x: 54, y: 71, scale: 1.1, pose: "crown", color: "#fff0db", prop: "crown" },
      { x: 80, y: 75, scale: 0.98, pose: "duel", color: "#f3d7ff", prop: "sword" },
    ],
  },
  {
    title: "Final Reconciliation",
    subtitle: "Old wounds, quiet peace",
    sky: ["#1a2240", "#3b5b7c", "#ac8a74"],
    light: "#fff1ca",
    curtain: "#6a2036",
    floor: "#1a1622",
    figures: [
      { x: 24, y: 74, scale: 1, pose: "reach", color: "#f6ead7", prop: "none" },
      { x: 55, y: 73, scale: 1.08, pose: "whisper", color: "#e6e2ff", prop: "balcony" },
      { x: 82, y: 76, scale: 0.95, pose: "watch", color: "#d6f0ff", prop: "torch" },
    ],
  },
];

const pick = (items) => items[Math.floor(Math.random() * items.length)];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const jitter = (value, spread) => value + (Math.random() * spread * 2 - spread);

const createScene = () => {
  const scene = pick(SCENES);
  const layoutXs = [500, 635, 770];

  return {
    ...scene,
    stars: Array.from({ length: 10 + Math.floor(Math.random() * 8) }, (_, index) => ({
      x: Math.random() * 1000,
      y: Math.random() * 180,
      r: 1 + (index % 3) * 0.5 + Math.random() * 1.4,
      opacity: 0.45 + Math.random() * 0.45,
    })),
    figures: scene.figures.map((figure, index) => ({
      ...figure,
      x: clamp(layoutXs[index] + jitter(0, 26), 460, 840),
      y: clamp(figure.y + 300 + jitter(0, 14), 340, 424),
      scale: clamp(jitter(figure.scale, 0.08), 0.74, 1.28),
    })),
    moon: {
      x: 850 + Math.random() * 70,
      y: 75 + Math.random() * 35,
      size: 42 + Math.random() * 12,
    },
  };
};

const poseArms = {
  reach: [
    [-2, 22, -26, 12],
    [2, 23, 26, 30],
  ],
  whisper: [
    [-2, 22, -16, 17],
    [2, 24, 20, 18],
  ],
  duel: [
    [-2, 22, -22, 18],
    [2, 22, 28, 14],
  ],
  think: [
    [-2, 22, -11, 12],
    [2, 23, 18, 22],
  ],
  crown: [
    [-2, 22, -8, 2],
    [2, 21, 12, 2],
  ],
  kneel: [
    [-2, 22, -18, 28],
    [2, 24, 15, 34],
  ],
  wave: [
    [-2, 22, -20, 10],
    [2, 23, 22, 2],
  ],
  watch: [
    [-2, 22, -16, 24],
    [2, 23, 18, 24],
  ],
};

const Figure = ({ color, pose, prop, x, y, scale }) => {
  const arms = poseArms[pose] ?? poseArms.watch;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        vectorEffect="non-scaling-stroke"
      >
        <circle cx="0" cy="14" r="7" fill="rgba(255,255,255,0.08)" />
        <circle cx="0" cy="14" r="5.8" />
        <path d="M 0 21 L 0 40" />
        <path d={`M ${arms[0][0]} ${arms[0][1]} L ${arms[0][2]} ${arms[0][3]}`} />
        <path d={`M ${arms[1][0]} ${arms[1][1]} L ${arms[1][2]} ${arms[1][3]}`} />
        <path d="M 0 40 L -8 58" />
        <path d="M 0 40 L 9 58" />
      </g>

      {prop === "crown" && (
        <path d="M -7 5 L -3 -1 L 0 4 L 4 -1 L 8 5 L 8 9 L -7 9 Z" fill={color} opacity="0.9" />
      )}

      {prop === "sword" && (
        <path
          d="M 26 15 L 50 7 M 50 7 L 54 11 M 50 7 L 54 3"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}

      {prop === "rose" && (
        <path
          d="M 17 24 C 20 18, 25 17, 28 20 C 24 23, 20 25, 17 24 Z"
          fill="#ff7da1"
          opacity="0.85"
        />
      )}

      {prop === "scroll" && (
        <path
          d="M -16 25 Q -2 18 13 25 Q -2 31 -16 25 Z"
          fill="rgba(255,255,255,0.22)"
          stroke={color}
          strokeWidth="2"
        />
      )}

      {prop === "lantern" && <circle cx="20" cy="17" r="4" fill="#ffd36f" opacity="0.95" />}

      {prop === "dagger" && (
        <path
          d="M 14 21 L 32 14 M 32 14 L 36 18 M 32 14 L 36 10"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}

      {prop === "letter" && (
        <path
          d="M 16 23 L 36 14 L 42 24 L 23 33 Z"
          fill="rgba(255,255,255,0.18)"
          stroke={color}
          strokeWidth="2"
        />
      )}

      {prop === "torch" && (
        <path
          d="M 18 18 C 20 10, 27 8, 29 15 C 31 21, 25 26, 21 28 C 17 26, 15 22, 18 18 Z"
          fill="#ff9d5c"
          opacity="0.9"
        />
      )}

      {prop === "balcony" && (
        <path
          d="M -14 10 L 16 10 L 16 15 L -14 15 Z"
          fill="rgba(255,255,255,0.14)"
          stroke={color}
          strokeWidth="2"
        />
      )}
    </g>
  );
};

const ShakespeareScene = () => {
  const [scene] = useState(createScene);

  return (
    <svg
      aria-hidden="true"
      className="background heroScene"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1000 600"
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <linearGradient id="skyGradient" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={scene.sky[0]} />
          <stop offset="54%" stopColor={scene.sky[1]} />
          <stop offset="100%" stopColor={scene.sky[2]} />
        </linearGradient>
        <radialGradient id="spotlight" cx="50%" cy="38%" r="48%">
          <stop offset="0%" stopColor={scene.light} stopOpacity="0.56" />
          <stop offset="45%" stopColor={scene.light} stopOpacity="0.18" />
          <stop offset="100%" stopColor={scene.light} stopOpacity="0" />
        </radialGradient>
        <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.7 0"
          />
        </filter>
      </defs>

      <rect width="1000" height="600" fill="url(#skyGradient)" />
      <ellipse cx="500" cy="255" rx="420" ry="220" fill="url(#spotlight)" />
      <ellipse cx="528" cy="500" rx="322" ry="72" fill="rgba(0,0,0,0.22)" />
      <circle
        cx={scene.moon.x}
        cy={scene.moon.y}
        r={scene.moon.size}
        fill="#fff5da"
        opacity="0.9"
        filter="url(#softGlow)"
      />

      {scene.stars.map((star, index) => (
        <circle
          key={`${star.x}-${index}`}
          cx={star.x}
          cy={star.y}
          r={star.r}
          fill="#fff9ea"
          opacity={star.opacity}
        />
      ))}

      <path
        d="M 0 462 C 140 438, 238 446, 352 468 C 448 486, 552 488, 648 468 C 762 446, 860 438, 1000 462 L 1000 600 L 0 600 Z"
        fill={scene.floor}
      />
      <path
        d="M 0 444 C 140 418, 240 424, 352 446 C 448 464, 552 464, 648 446 C 760 424, 860 418, 1000 444 L 1000 462 C 860 438, 762 446, 648 468 C 552 488, 448 486, 352 468 C 238 446, 140 438, 0 462 Z"
        fill="rgba(255,255,255,0.05)"
      />

      <path
        d="M 110 430 Q 528 362 900 430"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M 140 408 Q 528 340 860 408"
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M 0 0 L 155 0 C 114 92, 104 186, 128 304 C 94 252, 52 176, 0 132 Z"
        fill={scene.curtain}
        opacity="0.94"
      />
      <path
        d="M 1000 0 L 845 0 C 886 92, 896 186, 872 304 C 906 252, 948 176, 1000 132 Z"
        fill={scene.curtain}
        opacity="0.94"
      />
      <path
        d="M 0 0 H 1000 V 40 C 878 58, 748 60, 500 60 C 252 60, 122 58, 0 40 Z"
        fill="rgba(255,255,255,0.05)"
      />
      <path
        d="M 0 534 C 120 502, 220 500, 332 520 C 446 540, 554 540, 668 520 C 780 500, 880 502, 1000 534"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="3"
      />

      <text
        x="712"
        y="470"
        fill="#fff7ec"
        fontFamily="Cormorant Garamond, serif"
        fontSize="28"
        letterSpacing="0.08em"
        textAnchor="middle"
        opacity="0.32"
      >
        {scene.title}
      </text>
      <text
        x="712"
        y="496"
        fill="#fff7ec"
        fontFamily="Montserrat, sans-serif"
        fontSize="9"
        letterSpacing="0.22em"
        textAnchor="middle"
        opacity="0.2"
      >
        {scene.subtitle}
      </text>

      {scene.figures.map((figure, index) => (
        <Figure key={`${scene.title}-${index}`} {...figure} />
      ))}
    </svg>
  );
};

Figure.propTypes = {
  color: PropTypes.string.isRequired,
  pose: PropTypes.string.isRequired,
  prop: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
};

export default ShakespeareScene;
