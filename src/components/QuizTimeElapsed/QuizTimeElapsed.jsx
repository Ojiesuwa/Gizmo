import React from "react";
import "./QuizTimeElapsed.css";
const QuizTimeElapsed = ({
  isVisible,
  submitOnTimeElapse,
  handleSubmit,
  onHide,
  onViewCorrection,
  onViewAnalysis
}) => {
  if (!isVisible) return;
  return (
    <div className="QuizTimeElapsed">
      <div className="main-container fade">
        <div className="header-cont">
          <div className="heading-5">Time Elapsed</div>
          <i className="fa-light fa-circle-xmark" onClick={onHide}></i>
        </div>
        <div className="body-cont">
          {!submitOnTimeElapse ? (
            <p>
              Quiz time has elapsed
              <br />
              Cancel modal to resume quiz <br /> <br />{" "}
              <b>Submit quiz using the button below</b>
            </p>
          ) : (
            <p>
              Quiz time has elapsed
              <br />
              Your quiz has been submitted and graded <br /> <br />{" "}
              <b>View analysis and correction from below</b>
            </p>
          )}
        </div>
        <div className="footer-cont-2 ">
          {submitOnTimeElapse ? (
            <>
            <button onClick={onViewCorrection}>View Correction</button>
            <button onClick={onViewAnalysis}>View Analysis</button>
            </>
          ) : (
            <>
            <button onClick={handleSubmit}>Submit</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTimeElapsed;
