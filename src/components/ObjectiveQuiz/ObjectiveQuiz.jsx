import React from "react";
import "./ObjectiveQuiz.css";
import { randomizeArray } from "../../utils/array";
import ExplanationBox from "../ExplanationBox/ExplanationBox";

const ObjectiveQuiz = ({ question = [], onSelectAnswer, isGraded }) => {
  return (
    <div className="ObjectiveQuiz Quiz">
      <div className="user-quiz-cont">
        <p className="q">{question?.question || ""}</p>
      </div>
      <div
        className="h-full flex flex-col  gap-4"
        style={{ pointerEvents: isGraded ? "none" : "fill" }}
      >
        {question?.options.map((data, key) => (
          <div
            className="option-container flex items-center gap-3"
            onClick={() => onSelectAnswer(data)}
            key={key}
          >
            {data === question?.user ? (
              <i
                className={
                  "fa-solid fa-square " +
                  (!isGraded
                    ? ""
                    : question?.correctAnswer === data
                    ? "right-option"
                    : "wrong-option")
                }
              ></i>
            ) : (
              <i
                className={
                  "fa-light fa-square " +
                  (!isGraded
                    ? ""
                    : question?.correctAnswer === data
                    ? "right-option"
                    : "wrong-option")
                }
              ></i>
            )}
            <p>{data}</p>
          </div>
        ))}
      </div>
      {isGraded && (
        <>
          <ExplanationBox explanation={question?.explanation} />
          <div className="filler"></div>
        </>
      )}
    </div>
  );
};

export default ObjectiveQuiz;
