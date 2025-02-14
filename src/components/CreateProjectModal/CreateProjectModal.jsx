import React from "react";
import "./CreateProjectModal.css";
import useAuth from "../../hooks/useAuth";
import Button from "../Button/Button";

const CreateProjectModal = ({
  projectParameter,
  OnCreate,
  isVisible,
  onHide,
  isGenerating,
}) => {
  const { accountDetail } = useAuth();

  console.log(projectParameter);

  const explanationCost = projectParameter?.explanation ? 10 : 0;
  const pricePerQuestion = 3;
  const priceOfQuiz = projectParameter?.numberOfQuestions * pricePerQuestion;
  const actualPriceOfQuiz = priceOfQuiz < 100 ? 100 : priceOfQuiz;
  const totalCost = actualPriceOfQuiz + explanationCost;
  const xp = projectParameter.numberOfQuestions * 2;

  if (!isVisible) return null;
  return (
    <div className="CreateProjectModal">
      <div className="main-container">
        <div className="header">
          <div className="heading-5">Create Project</div>
          <i className="fa-light fa-circle-xmark" onClick={onHide}></i>
        </div>
        <div className="body">
          <div className="fund-container">
            <p className="wallet">Wallet Funds</p>
            <p className="fund">
              N {(accountDetail?.wallet || 0).toLocaleString("fr-FR") || 0}
            </p>
          </div>
          <div className="bill-container">
            <div className="bill-item flex items-center gap-2 justify-between">
              <div className="left flex items-center gap-2">
                <i className="fa-light fa-circle-check"></i>
                <p>Explantion</p>
              </div>
              <div className="right">
                <p>N {explanationCost}</p>
              </div>
            </div>
            <div className="bill-item flex items-center gap-2 justify-between mt-3">
              <div className="left flex items-center gap-2">
                <i className="fa-light fa-circle-check"></i>
                <p>Number of Quizzes ({projectParameter?.numberOfQuestions})</p>
              </div>
              <div className="right">
                <p>N {actualPriceOfQuiz}</p>
              </div>
            </div>
            <div className="total-item">
              <div className="bill-item">
                <div className="left">
                  <p>Total Deduction</p>
                </div>
                <p>N {totalCost}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <Button
            text={`Create Project (+${xp}XP)`}
            isLoading={isGenerating}
            loadingText={"Generating Your Project"}
            onClick={() => OnCreate(xp, totalCost)}
            disabled={
              totalCost >
              (isNaN(accountDetail?.wallet || 0) || !accountDetail?.wallet
                ? 0
                : accountDetail?.wallet)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
