import React, { useState } from "react";
import "./QuestionBar.css";
import MiniLoader from "../MiniLoader/MiniLoader";

const QuestionBar = ({ isVisible, explantion, onHide }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  return (
    <div className={"QuestionBar " + (isVisible ? "qb-active" : "qb-inactive")}>
      <p className="heading-5">Ask a question</p>
      <div className="line"></div>
      <div className="input-box flex gap-4">
        <textarea
          type="text"
          placeholder="Write question"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button>Submit</button>
      </div>
      <div
        className={
          "response-cont " + (response || isLoading ? "full-q-b" : "half-q-b")
        }
      >
        {isLoading && <MiniLoader />}
      </div>
      <div className="hide-cont">
        <i className="fa-light fa-chevron-up" onClick={onHide}></i>
      </div>
    </div>
  );
};

export default QuestionBar;
