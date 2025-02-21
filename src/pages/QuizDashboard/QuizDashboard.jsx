import React, { useEffect, useState } from "react";
import "./QuizDashboard.css";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { isDocumentExistentWithId } from "../../firebase/firebaseTools";
import {
  fetchAndVerifyProject,
  setProjectLevel,
} from "../../controllers/projects";
import { fetchExplanation } from "../../controllers/explanation";
import {
  fetchQuiz,
  fetchQuizDb,
  generateQuizFromDb,
  updateQuiz,
  uploadQuiz,
} from "../../controllers/quiz";
import PageLoader from "../../components/PageLoader/PageLoader";
import { navigation } from "../../site/navigation";

const QuizDashboard = () => {
  const { userCredential } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const numberOfMultipleChoice = quiz?.filter(
    (data) => data.type === "mcq"
  ).length;

  const numberOfFillInGap = quiz?.filter((data) => data.type === "fig").length;

  const numberOfTheory = quiz?.filter((data) => data.type === "theory").length;

  const fetchAndUpdateState = async () => {
    try {
      setIsLoading(true);
      const isProjectExistent = await isDocumentExistentWithId(
        "Project",
        params.id
      );

      if (!isProjectExistent) {
        throw new Error("Invalid Project");
      }

      const projectDb = await fetchAndVerifyProject(
        params.id,
        userCredential.uid
      );

      document.title = `Dashboard - ${projectDb.title}`;

      let explanationDb = null;
      if (projectDb?.explanation) {
        explanationDb = await fetchExplanation(projectDb.lectureId);
      }
      const quizDb = await fetchQuiz(
        projectDb.history[projectDb.history.length - 1]
      );

      setProject(projectDb);
      setExplanation(explanationDb);
      setQuiz(quizDb);
    } catch (error) {
      console.error(error);
      if (error.message.includes("Not user project")) {
        toast.error("Unauthorized access");
        return navigate("/");
      }
      if (error.message.includes("Invalid Project")) {
        toast.error("Unrecognized Project Id");
        return navigate("/");
      }
      toast.error("Error loading project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickLecture = () => {
    navigate(
      navigation.lecturePage.base +
        "/" +
        project?.docId +
        "/" +
        project?.lectureId
    );
  };
  const handleClickQuiz = () => {
    if (project?.progress < 200) return;
    navigate(
      navigation.quizViewPage.base +
        "/" +
        project?.docId +
        "/" +
        project?.history[project?.history.length - 1]
    );
  };

  const handleClickGrade = () => {
    if (project?.progress < 300) return;
    navigate(
      navigation.gradingPage.base +
        "/" +
        project?.docId +
        "/" +
        project?.history[project?.history.length - 1]
    );
  };

  const handleResetQuiz = async () => {
    try {
      setIsLoading(true);
      const quizDb = await fetchQuizDb(project?.quizDbId);
      console.log(quizDb);
      const quiz = generateQuizFromDb({ quizDb, project: project });
      console.log(quiz, quizDb, project);

      await updateQuiz(quiz, project?.history[0]);
      await setProjectLevel(params.id, 0);
      await fetchAndUpdateState();
      toast.success("Project Reset Complete");
      toast.success("New Quiz Generated");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't reset project");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!userCredential) return;
    fetchAndUpdateState();
  }, [userCredential, location]);
  return (
    <div className="QuizDashboard fade">
      <div className="quiz-header">
        <p className="heading-4">{project?.title}</p>
        <div className="flex gap-3 q-h-b-c">
          <button className="reset-btn" onClick={handleResetQuiz}>
            Reset
          </button>
          <button
            onClick={() =>
              navigate(
                navigation.lecturePage.base +
                  "/" +
                  project.docId +
                  "/" +
                  project.lectureId
              )
            }
          >
            Begin
          </button>
        </div>
      </div>
      <div className="quiz-body">
        {project?.explanation && (
          <div
            className={
              "quiz-section " +
              (project?.progress >= 0 ? "done-section" : "not-done-section")
            }
            onClick={handleClickLecture}
          >
            <div className={"section-header "}>
              <p className="heading-4">Stage One: Lecture Phase</p>
              <div className="line"></div>
            </div>
            <div className="section-content">
              {explanation?.map((data, index) => (
                <div className="section-wrapper" key={index}>
                  <div className="line"></div>
                  <i className="fa-light fa-square-plus"></i>
                  <p>{data.topic}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div
          className={
            "quiz-section " +
            (project?.progress >= 200 ? "done-section" : "not-done-section")
          }
          onClick={handleClickQuiz}
        >
          <div className="section-header">
            <p className="heading-4">
              Stage {project?.explanation ? "Two" : "One"}: Quiz Phase
            </p>
            <div className="line"></div>
          </div>
          <div className="section-content">
            <div className="section-wrapper">
              <div className="line"></div>
              <i className="fa-light fa-square-plus"></i>
              <p>
                Multiple Choice Questions ({numberOfMultipleChoice} questions)
              </p>
            </div>
            <div className="section-wrapper">
              <div className="line"></div>
              <i className="fa-light fa-square-plus"></i>
              <p>FIll In The Gap Questions ({numberOfFillInGap} questions)</p>
            </div>
            <div className="section-wrapper">
              <div className="line"></div>
              <i className="fa-light fa-square-plus"></i>
              <p>Theory Questions ({numberOfTheory} questions)</p>
            </div>
          </div>
        </div>
        <div
          className={
            "quiz-section " +
            (project?.progress >= 300 ? "done-section" : "not-done-section")
          }
          onClick={handleClickGrade}
        >
          <div className="section-header">
            <p className="heading-4">
              Stage {project?.explanation ? "Three" : "Two"}: Grading Phase
            </p>
            <div className="line"></div>
          </div>
          <div className="section-content">
            <div className="section-wrapper">
              <div className="line"></div>
              <i className="fa-light fa-square-plus"></i>
              <p>Accuracy Score</p>
            </div>
            <div className="section-wrapper">
              <div className="line"></div>
              <i className="fa-light fa-square-plus"></i>
              <p>Score per Topic</p>
            </div>
            <div className="section-wrapper">
              <div className="line"></div>
              <i className="fa-light fa-square-plus"></i>
              <p>Score per Quiz Type</p>
            </div>
            <div className="section-wrapper">
              <div className="line"></div>
              <i className="fa-light fa-square-plus"></i>
              <p>Recommendations</p>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <PageLoader />}
    </div>
  );
};

export default QuizDashboard;
