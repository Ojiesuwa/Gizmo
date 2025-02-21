import React, { useEffect, useState } from "react";
import "./GradingPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { navigation } from "../../site/navigation";
import PageLoader from "../../components/PageLoader/PageLoader";
import useAuth from "../../hooks/useAuth";
import { fetchAndVerifyProject } from "../../controllers/projects";
import {
  deduceScorePerQuizType,
  deduceScorePerTopic,
  fetchQuiz,
} from "../../controllers/quiz";
import { toast } from "react-toastify";
const GradingPage = () => {
  // Hooks
  const navigate = useNavigate();
  const params = useParams();
  const { userCredential } = useAuth();

  const [project, setProject] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Working variables
  const score = quiz?.filter((data) => data.grade).length;
  const total = quiz?.length;
  const accuracy = ((score / total) * 100).toFixed(0);

  const scorePertopic = deduceScorePerTopic(quiz);
  // console.log$&

  const scorePerType = deduceScorePerQuizType(quiz);

  // console.log$&

  const handleQuizHome = () => {
    navigate(navigation.quizDashboard.base + "/" + params.projectId);
  };

  const handleFetchAndUpdateState = async () => {
    try {
      // Fetch project
      const projectDb = await fetchAndVerifyProject(
        params.projectId,
        userCredential.uid
      );

      document.title = `Grade - ${projectDb.title}`;

      if (projectDb.progress < 300) {
        toast("Quiz Ungraded");
        navigate(navigation.quizDashboard.base + "/" + params.projectId);
      }

      const quizId = projectDb.history[projectDb.history.length - 1];

      // Fetch Quiz
      const quizDb = await fetchQuiz(params.quizId);
      // console.log$&

      // Update project and Quiz
      setQuiz(quizDb);
      setProject(projectDb);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Error loading project");
      navigate("/");
    }
  };

  useEffect(() => {
    if (!userCredential) return;
    handleFetchAndUpdateState();
  }, [userCredential]);

  return (
    <div className="GradingPage">
      <div className="page-header">
        <p className="heading-4">{project?.title}</p>
        <p
          className="stage c-pointer"
          onClick={handleQuizHome}
          title="Back to home"
        >
          Grading
        </p>
      </div>
      <div className="page-body">
        <div className="left-wrapper">
          <p className="score pass">{accuracy}%</p>
          <p className="label">
            Accuracy ({score} / {total})
          </p>
          <button
            onClick={() =>
              navigate(
                navigation.quizViewPage.base +
                  "/" +
                  params.projectId +
                  "/" +
                  params.quizId
              )
            }
          >
            View Correction
          </button>
        </div>
        <div className="right-wrapper">
          <div className="grade-section">
            <div className="section-header">Score Per Topic</div>
            <div className="section-body">
              {scorePertopic.map((data) => (
                <div className="section-value">
                  <p className="left-title">{data?.topic}</p>
                  <p className="right-value">
                    {data?.score} / {data?.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="grade-section">
            <div className="section-header">Score Per Quiz Type</div>
            <div className="section-body">
              <div className="section-value">
                <p className="left-title">Theory Questions</p>
                <p className="right-value">
                  {" "}
                  {scorePerType?.theory?.score}/ {scorePerType?.theory?.count}
                </p>
              </div>
              <div className="section-value">
                <p className="left-title">Multiple Choice Question</p>
                <p className="right-value">
                  {" "}
                  {scorePerType?.mcq?.score}/ {scorePerType?.mcq?.count}
                </p>
              </div>
              <div className="section-value">
                <p className="left-title">Fill In the Gap Questions</p>
                <p className="right-value">
                  {" "}
                  {scorePerType?.fig?.score}/ {scorePerType?.fig?.count}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <PageLoader />}
    </div>
  );
};

export default GradingPage;
