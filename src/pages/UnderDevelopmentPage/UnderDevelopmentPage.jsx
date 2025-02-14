import React from "react";
import "./UnderDevelopmentPage.css";
import MiningGif from "../../assets/dev.gif";

const UnderDevelopmentPage = () => {
  return (
    <div className="UnderDevelopmentPage">
      <img src={MiningGif} alt="" />
      <p className="big-text">
        We are sorry <br />
        This Page is currently under development
      </p>
    </div>
  );
};

export default UnderDevelopmentPage;
