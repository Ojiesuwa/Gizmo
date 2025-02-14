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
            return (
              <input
                type="text"
                value={
                  question?.user === null ? "" : question?.user[gapCount - 1]
                }
                key={gapCount}
                onChange={(e) => onFillInTheGap(gapCount - 1, e.target.value)}
              />
            );
          } else {
            return <p className="q">{word}</p>;
          }
        })}
      </div>
      {isGraded && (
        <div className="answer-box">
          <p className="title">Answer</p>
          <p className="theory-answer">{question?.correctAnswer}</p>
        </div>
      )}
      {isGraded && <ExplanationBox explanation={question?.explanation} />}
      <div className="filler"></div>
    </div>
  );
};

export default FillInTheGapQuiz;
