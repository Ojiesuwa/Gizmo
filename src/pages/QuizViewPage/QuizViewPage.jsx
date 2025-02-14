import React, { useEffect, useState } from "react";
import "./QuizViewPage.css";
import TheoryQuiz from "../../components/TheoryQuiz/TheoryQuiz";
import ObjectiveQuiz from "../../components/ObjectiveQuiz/ObjectiveQuiz";
import FillInTheGapQuiz from "../../components/FillInTheGapQuiz/FillInTheGapQuiz";
import { fetchExplanation } from "../../controllers/explanation";
import {
  fetchAndVerifyProject,
  setProjectLevel,
} from "../../controllers/projects";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import PageLoader from "../../components/PageLoader/PageLoader";
import { fetchQuiz, gradeQuiz, updateQuiz } from "../../controllers/quiz";
import Button from "../../components/Button/Button";
import { navigation } from "../../site/navigation";
import { increaseAccountXp } from "../../controllers/account";
import { calculateTimeFromExpectedDuration } from "../../utils/timer";
import QuizTimeElapsed from "../../components/QuizTimeElapsed/QuizTimeElapsed";
const QuizViewPage = () => {
  // Hooks
  const { userCredential } = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quizIndex, setQuizIndex] = useState(0);
  const [isGrading, setIsGrading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);

  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTimeElapsed, setIsTimeElapsed] = useState(false);

  const timerLimit = !project
    ? 0
    : calculateTimeFromExpectedDuration(project?.expectedDuration);

  const isTimed = timerLimit > 0;

  console.log(project);

  const handleFetchAndUpdateState = async () => {
    try {
      setIsFetching(true);
      // Fetch project
      const projectDb = await fetchAndVerifyProject(
        params.projectId,
        userCredential.uid
      );

      const quizId = projectDb.history[projectDb.history.length - 1];
      //  verify explanation id
      if (params.quizId !== quizId) {
        throw new Error("Not User Explanation");
      }

      document.title = `Quiz - ${projectDb.title}`;

      // Fetch Quiz
      const quizDb = await fetchQuiz(quizId);
      console.log(quizDb);

      if (projectDb?.progress < 200) {
        setProjectLevel(params?.projectId, 200);
      }

      // Update project and Quiz
      setQuiz(quizDb);
      setProject(projectDb);
      setIsLoading(false);
      setQuizIndex(0);

      setInterval(() => {
        // Stop counting once we've reached the expected time limit

        const expectedDuration = calculateTimeFromExpectedDuration(
          projectDb?.expectedDuration
        );
        if (timeSpent > expectedDuration) return;
        // Increase by one every one second
        if (projectDb.timer)
          setTimeSpent((p) => {
            const timeSpent = p + 1;
            return timeSpent;
          });
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Error loading project");
      navigate("/");
    } finally {
      setIsFetching(false);
    }
  };

  const handleNextQuiz = () => {
    setQuizIndex((p) => {
      const quizLength = quiz.length;
      if (quizLength === undefined || quizLength === null) return p;
      if (p === quizLength - 1) return p;

      // Update proress
      setProgress(
        (pr) =>
          quiz.filter(
            (data) =>
              data.user !== null &&
              (data.user !== "") & (data.user?.length !== 0)
          ).length
      );
      return p + 1;
    });
  };

  const handlePreviousQuiz = () => {
    setQuizIndex((p) => {
      const quizLength = quiz.length;
      if (quizLength === undefined || quizLength === null) return p;
      if (p === 0) return p;
      return p - 1;
    });
  };

  const handleFillInTheGap = (userIndex, value) => {
    const index = quizIndex;

    const quizTemp = [...quiz];
    quizTemp[index].user = !quizTemp[index].user
      ? quizTemp[index]?.correctAnswer.map((d) => "")
      : quizTemp[index].user;

    quizTemp[index].user[userIndex] = value;

    setQuiz([]);
    setQuiz(quizTemp);
  };

  const handleMultipleChoice = (value) => {
    const index = quizIndex;

    const quizTemp = [...quiz];

    quizTemp[index].user = value;
    setQuiz(quizTemp);
  };

  const handleTheory = (value) => {
    if (value.split(" ").length === 100) {
      return;
    }
    const index = quizIndex;

    const quizTemp = [...quiz];

    quizTemp[index].user = value;
    setQuiz(quizTemp);
  };

  const handleSubmitQuiz = async (freezeUpdate) => {
    try {
      setIsGrading(true);
      const gradedQuiz = await gradeQuiz(quiz);

      const score = gradedQuiz.filter((question) => question.grade).length;

      const xpAmount = Math.round(score * 1.5);

      await increaseAccountXp(
        userCredential?.uid,
        xpAmount < 10 ? 10 : xpAmount
      );
      await updateQuiz(gradedQuiz, params.quizId);
      if (project.progress < 300) {
        await setProjectLevel(params.projectId, 300);
      }

      toast.success("Your Project has been graded");
      toast.success("XP boosted by " + xpAmount + " points");
      if (!freezeUpdate) handleFetchAndUpdateState();
    } catch (error) {
      console.error(error);
      toast.error("Error grading quiz");
    } finally {
      setIsGrading(false);
    }
  };
  const handleQuizHome = () => {
    navigate(navigation.quizDashboard.base + "/" + params.projectId);
  };

  // Monitor Time
  useEffect(() => {
    if (project?.progress !== 200) return;
    if (isTimeElapsed) return;
    const notificationTime = [
      { mark: 3600, message: "You have 1 hour left" },
      { mark: 1800, message: "You have 30 minutes left" },
      { mark: 900, message: "You have 15 minutes left" },
      { mark: 300, message: "You have 5 minutes left" },
      { mark: 60, message: "You have 1 minute left" },
      { mark: 30, message: "You have 30 seconds left" },
    ];

    notificationTime.forEach((time) => {
      if (timerLimit - timeSpent === time.mark) {
        toast(time.message);
      }
    });
    if (timeSpent > timerLimit) {
      if (project?.submitOnTimeElapse) {
        handleSubmitQuiz(true);
      }
      setIsTimeModalVisible(true);
      setIsTimeElapsed(true);
    }
  }, [timeSpent]);

  useEffect(() => {
    if (!userCredential) return;
    handleFetchAndUpdateState();
  }, [userCredential]);

  return (
    <div
      className="QuizViewPage"
      style={{ pointerEvents: isGrading ? "none" : "fill" }}
    >
      <div className="page-header">
        <p className="heading-4">{project?.title}</p>
        <p
          className="stage c-pointer"
          onClick={handleQuizHome}
          title="Back to home"
        >
          Quiz
        </p>
      </div>
      <div className="control-header">
        <div className="main-header">
          <div className="left-wrapper">
            <div className="nav-wrapper" onClick={handlePreviousQuiz}>
              <i className="fa-light fa-chevron-left"></i>
            </div>
            <p className="question-disp">
              Question {quizIndex + 1} / {quiz.length}
            </p>
            <div className="nav-wrapper" onClick={handleNextQuiz}>
              <i className="fa-light fa-chevron-right"></i>
            </div>
          </div>
          <div className="center-wrapper">
            <p className="question-topic">{quiz[quizIndex]?.topic}</p>
          </div>
          <div className="right-wrapper">
            <div className="disp-cont">
              <p>Progress</p>
              <progress value={progress} max={quiz?.length}></progress>
            </div>
            {project?.timer && (
              <div className="disp-cont">
                <p>Time</p>
                <progress
                  value={project.progress === 200 ? timeSpent : 100}
                  max={project.progress === 200 ? timerLimit : 100}
                ></progress>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="question-cont">
        {quiz[quizIndex]?.type === "mcq" ? (
          <ObjectiveQuiz
            question={quiz[quizIndex]}
            onSelectAnswer={handleMultipleChoice}
            isGraded={project?.progress > 200}
          />
        ) : quiz[quizIndex]?.type === "theory" ? (
          <TheoryQuiz
            question={quiz[quizIndex]}
            onWriteAnswer={handleTheory}
            isGraded={project?.progress > 200}
          />
        ) : (
          <FillInTheGapQuiz
            question={quiz[quizIndex]}
            onFillInTheGap={handleFillInTheGap}
            isGraded={project?.progress > 200}
          />
        )}
      </div>
      <div className="footer-cont">
        <div className="left-control">
          <button onClick={handlePreviousQuiz}>Previous</button>
          <button onClick={handleNextQuiz}> Next</button>
        </div>
        <div className="right-control">
          {project?.progress > 200 && (
            <i className="fa-solid fa-circle-arrow-down anim-bounce"></i>
          )}
          <Button
            text={project?.progress >= 300 ? "View Analysis" : "Submit"}
            isLoading={isGrading}
            loadingText={"Grading..."}
            disabled={isFetching}
            onClick={
              project?.progress >= 300
                ? () =>
                    navigate(
                      navigation.gradingPage.base +
                        "/" +
                        params.projectId +
                        "/" +
                        params.quizId
                    )
                : () => handleSubmitQuiz(false)
            }
          />
        </div>
      </div>
      {isLoading && <PageLoader />}
      <QuizTimeElapsed
        isVisible={isTimeModalVisible && project?.progress == 200}
        onHide={() => setIsTimeModalVisible(false)}
        submitOnTimeElapse={project?.submitOnTimeElapse}
        handleSubmit={() => handleSubmitQuiz(false)}
        onViewCorrection={handleFetchAndUpdateState}
        onViewAnalysis={() =>
          navigate(
            navigation.gradingPage.base +
              "/" +
              params.projectId +
              "/" +
              params.quizId
          )
        }
      />
    </div>
  );
};

export default QuizViewPage;
