import React from "react";
import "./TheoryQuiz.css";
import ExplanationBox from "../ExplanationBox/ExplanationBox";
const TheoryQuiz = ({ question, onWriteAnswer, isGraded }) => {
  return (
    <div className="TheoryQuiz Quiz">
      <div className="user-quiz-cont">
        <p className="q">{question?.question}</p>
      </div>
      <div className="h-full flex flex-col items-end gap-3">
        <textarea
          name=""
          id=""
          placeholder="Enter value here"
          value={question?.user}
          onChange={(e) => onWriteAnswer(e.target.value)}
          disabled={isGraded}
          className={`${
            !isGraded ? "" : question?.grade ? "theory-good" : "theory-bad"
          }`}
        ></textarea>
        <p className="word-count">
          Words: {question?.user?.trim().split(" ").length || 0}/ 100
        </p>
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

export default TheoryQuiz;
