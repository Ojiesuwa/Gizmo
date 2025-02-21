import React from "react";
import "./FillInTheGapQuiz.css";
import { generateUUID } from "../../utils/uuid";
import ExplanationBox from "../ExplanationBox/ExplanationBox";

const FillInTheGapQuiz = ({ question, onFillInTheGap, isGraded }) => {
  let gapCount = 0;
  return (
    <div
      className={
        "FillInTheGapQuiz Quiz " +
        (!isGraded ? "" : question?.grade ? "fig-correct" : "fig-incorrect")
      }
      style={{ pointerEvents: isGraded ? "none" : "fill" }}
    >
      <div className="question-wrapper">
        {question?.question.split(" ").map((word, key) => {
          if (word.includes("[")) {
            gapCount++;
            const index = word[1];
            return (
              <input
                type="text"
                value={question?.user === null ? "" : question?.user[index]}
                key={gapCount}
                onChange={(e) => onFillInTheGap(index, e.target.value)}
              />
            );
          } else {
            return (
              <p className="q" key={key}>
                {word}
              </p>
            );
          }
        })}
      </div>
      {isGraded && (
        <div className="answer-box">
          <p className="title">Answer</p>
          <p className="theory-answer">
            {(question?.correctAnswer).join(", ")}
          </p>
        </div>
      )}
      {isGraded && <ExplanationBox explanation={question?.explanation} />}
      <div className="filler"></div>
    </div>
  );
};

export default FillInTheGapQuiz;
