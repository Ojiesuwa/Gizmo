import React from "react";
import "./ExplanationBox.css";

const ExplanationBox = ({ explanation }) => {
  return (
    <div className="ExplanationBox ">
      <div className="heading">
        <p className="heading-5">Explanation</p>
      </div>
      <div className="body">{explanation}</div>
    </div>
  );
};

export default ExplanationBox;
