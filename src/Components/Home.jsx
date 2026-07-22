/**
 * Home component
 *
 * The section at the top of the page to display image of your
 * choice, name and title that describes your career focus.
 */

import React from "react";
import arrowSvg from "../images/down-arrow.svg";
import PropTypes from "prop-types";
import ShakespeareScene from "./ShakespeareScene";

const Home = ({ name, title }) => {
  const [firstName = "", middleInitial = "", ...lastNameParts] = name.split(" ");
  const lastName = lastNameParts.join(" ");

  return (
    <section id="home" className="min-height">
      <ShakespeareScene />
      <div
        style={{
          position: "absolute",
          top: "14vh",
          left: "8vw",
          width: "20rem",
          zIndex: 2,
          textAlign: "left",
          color: "#fff7ec",
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.35)",
        }}
      >
        <h1 className="theaterName">
          <span>{firstName}</span>
          <span>{middleInitial}</span>
          <span>{lastName}</span>
        </h1>
        <h2>{title}</h2>
      </div>
      <div style={{ position: "absolute", bottom: "3rem", left: "50%" }}>
        <img
          src={arrowSvg}
          style={{ height: "3rem", width: "3rem" }}
          alt="Scroll to the next section"
        />
      </div>
    </section>
  );
};

Home.defaultProps = {
  name: "",
  title: "",
};

Home.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Home;
