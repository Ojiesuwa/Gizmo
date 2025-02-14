import React, { useEffect, useRef, useState } from "react";
import "./LecturePage.css";
import Board from "../../assets/board.png";
import Welcome from "../../assets/welcome.gif";
import Explain from "../../assets/explain.gif";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageLoader from "../../components/PageLoader/PageLoader";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import {
  fetchAndVerifyProject,
  setProjectLevel,
} from "../../controllers/projects";
import { fetchExplanation } from "../../controllers/explanation";
import QuestionBar from "../../components/QuestionBar/QuestionBar";
import { navigation } from "../../site/navigation";

const LecturePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { userCredential, accountDetail } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState([]);
  const [project, setProject] = useState(null);
  const [hasIntroduced, setHasIntroduced] = useState(false);
  const [explanationIndex, setExplanationIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestioning, setIsQuestioning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  console.log(hasIntroduced);
  console.log(explanationIndex);

  const handleAskQuestion = () => {
    setHasIntroduced(true);
    setIsQuestioning(true);
    // if (window.responsiveVoice) {
    //   setTimeout(() => {
    //     setIsQuestioning(true);
    //   }, 1500);
    //   responsiveVoice.speak(
    //     "I see you have a question, Feel free to ask " +
    //       accountDetail?.firstname,
    //     "Australian Female",
    //     {
    //       rate: 1.1,
    //       onstart: () => setIsPlaying(true),
    //       onend: () => {
    //         setIsPlaying(false);
    //       },
    //       onerror: () => setIsPlaying(false),
    //     }
    //   );
    // }
  };
  const handleHideQuestionBar = () => {
    setIsQuestioning(false);

    // if (window.responsiveVoice) {
    //   window.responsiveVoice.cancel();
    //   responsiveVoice.speak(
    //     accountDetail?.firstname +
    //       ", I hope I have been able to answer your questions ",
    //     "Australian Female",
    //     {
    //       rate: 1.1,
    //       onstart: () => setIsPlaying(true),
    //       onend: () => {
    //         setIsPlaying(false);
    //         handleCourseChange(explanationIndex, false);
    //       },
    //       onerror: () => setIsPlaying(false),
    //     }
    //   );
    // }
  };
  const handleFetchAndUpdateState = async () => {
    try {
      // Fetch project
      const projectDb = await fetchAndVerifyProject(
        params.projectId,
        userCredential.uid
      );
      //  verify explanation id
      if (params.lectureId !== projectDb.lectureId) {
        throw new Error("Not User Explanation");
      }

      document.title = `Lecture - ${projectDb.title}`;
      // Fetch Explanation
      const explanation = await fetchExplanation(projectDb.lectureId);
      // Update project and explanation
      setProject(projectDb);
      setExplanation(explanation);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Error loading project");
      navigate("/");
    }
  };

  const handleIntroductionSpeech = () => {
    setHasIntroduced(true);
    // if (window.responsiveVoice) {
    //   if (isPlaying) {
    //     window.responsiveVoice.cancel();
    //     setIsPlaying(false);
    //   } else {
    //     window.responsiveVoice.speak(
    //       "Hi, My name is Olivia. I will be your tutor for Gizmo, and we will be discussing your quiz content before you begin the quiz. Let's begin",
    //       "Australian Female",
    //       {
    //         rate: 1.1,
    //         onstart: () => setIsPlaying(true),
    //         onend: () => {
    //           setIsPlaying(false);
    //         },
    //         onerror: () => setIsPlaying(false),
    //       }
    //     );
    //   }
    // } else {
    //   console.error("ResponsiveVoice is not available");
    // }
  };

  const handleExplanationSpeech = () => {
    if (window.responsiveVoice) {
      if (isPlaying) {
        window.responsiveVoice.cancel();
        setIsPlaying(false);
      } else {
        window.responsiveVoice.speak(
          explanation[explanationIndex].explanation,
          "Australian Female",
          {
            rate: 1.18,
            onstart: () => setIsPlaying(true),
            onend: () => {
              setIsPlaying(false);
              handleChangeToNextTopic();
            },
            onerror: () => setIsPlaying(false),
          }
        );
      }
    } else {
      console.error("ResponsiveVoice is not available");
    }
  };

  const handleCourseChange = (newIndex, update) => {
    if (update) {
      setExplanationIndex(newIndex);
    }
    // if (window.responsiveVoice) {
    //   if (isPlaying) {
    //     window.responsiveVoice.cancel();
    //     window.responsiveVoice.cancel();
    //     setIsPlaying(false);
    //   }
    //   window.responsiveVoice.speak(
    //     explanation[newIndex].explanation,
    //     "Australian Female",
    //     {
    //       rate: 1.1,
    //       onstart: () => setIsPlaying(true),
    //       onend: () => {
    //         handleChangeToNextTopic();
    //       },
    //       onerror: () => setIsPlaying(false),
    //     }
    //   );
    // } else {
    //   console.error("ResponsiveVoice is not available");
    // }
  };

  const handleSpaceBarClick = () => {
    if (!hasIntroduced) {
      setHasIntroduced(true);

      setIsPlaying(false);
      window.responsiveVoice.cancel();
      handleCourseChange(0, false);
    } else {
      if (isQuestioning) return;
      handleExplanationSpeech();
    }
  };

  const handleChangeToPreviousTopic = () => {
    console.log(explanationIndex);

    // if (explanationIndex === 0) return;
    setExplanationIndex((p) => {
      const newValue = p === 0 ? 0 : p - 1;
      handleCourseChange(newValue, false);
      return newValue;
    });
  };

  const handleChangeToNextTopic = () => {
    console.log("Course has  been moved to the next topic");

    setExplanationIndex((p) => {
      p = parseInt(p);

      const newValue = parseInt(p === explanation.length - 1 ? p : p + 1);

      if (parseInt(p + 1) === explanation.length && !isLoading) {
        // setHasFinished(true);
        toast.success("Lecture complete. Click jump to quiz");
        // if (window.responsiveVoice) {
        //   if (isPlaying) {
        //     window.responsiveVoice.cancel();
        //     window.responsiveVoice.cancel();
        //     setIsPlaying(false);
        //   }
        //   // handleCompleteLecture();
        //   // window.responsiveVoice.speak(
        //   //   "This is the end of our lecture. Now you are prepared for the quiz. Your quiz will begin in 5 seconds",
        //   //   "Australian Female",
        //   //   {
        //   //     rate: 1.1,
        //   //     onstart: () => setIsPlaying(true),
        //   //     onend: () => {
        //   //       setTimeout(() => {
        //   //       }, 5000);
        //   //       setIsPlaying(false);
        //   //       setIsLoading(true);
        //   //     },
        //   //     onerror: () => setIsPlaying(false),
        //   //   }
        //   // );
        // } else {
        //   console.error("ResponsiveVoice is not available");
        // }
      } else {
        handleCourseChange(newValue, false);
      }
      return newValue;
    });
  };

  const handleCompleteLecture = async () => {
    try {
      setIsLoading(true);
      if (project?.progress < 200) {
        await setProjectLevel(params.projectId, 200);
      }

      navigate(
        navigation.quizViewPage.base +
          "/" +
          params.projectId +
          "/" +
          project?.history[project?.history.length - 1]
      );
    } catch (error) {
      console.error(error);
      toast.error("Error loading project");
    }
  };

  const handleQuizHome = () => {
    navigate(navigation.quizDashboard.base + "/" + params.projectId);
  };

  useEffect(() => {
    window.responsiveVoice.cancel();
  }, [location]);

  useEffect(() => {
    if (!userCredential) return;
    handleFetchAndUpdateState();
  }, [userCredential]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        const activeElement = document.activeElement;
        const isTyping =
          activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.isContentEditable;

        if (isTyping) return;

        event.preventDefault();
        handleSpaceBarClick();
      }
      if (event.key === "Q" || event.key === "q") {
        responsiveVoice.cancel();
        setIsPlaying(false);
        handleAskQuestion();
      }
      if (event.code === "ArrowLeft" && hasIntroduced) {
        responsiveVoice.cancel();
        setIsPlaying(false);
        handleChangeToPreviousTopic();
      }
      if (event.code === "ArrowRight" && hasIntroduced) {
        handleChangeToNextTopic();
      }
    };
    document.removeEventListener("keydown", handleKeyDown);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasIntroduced]);

  return (
    <div className="LecturePage fade">
      <div className="lecture-heading">
        <p className="heading-4">{project?.title}</p>
        <p
          className="stage c-pointer"
          onClick={handleQuizHome}
          title="Back to home"
        >
          Lecture
        </p>
      </div>
      {window.innerWidth > 700 && (
        <p className="message">
          *Use spacebar to continue, arrow keys to navigate, Q to ask a question
        </p>
      )}
      <div className="lecture-main">
        {!hasIntroduced ? (
          <IntroductionScreen
            projectTitle={project?.title}
            handleSpaceBarClick={handleSpaceBarClick}
            hasIntroduced={hasIntroduced}
            isPlaying={isPlaying}
          />
        ) : (
          <LectureScreen
            projectTitle={project?.title}
            explanation={explanation[explanationIndex]}
            handleSpaceBarClick={handleSpaceBarClick}
            hasIntroduced={hasIntroduced}
            isPlaying={isPlaying}
            isQuestioning={isQuestioning}
            handleAskQuestion={handleAskQuestion}
            project={project}
            handleCompleteLecture={handleCompleteLecture}
          />
        )}
      </div>
      <div className="lecture-footer">
        {hasIntroduced && (
          <>
            <i
              className="fa-light fa-chevron-left"
              onClick={handleChangeToPreviousTopic}
            ></i>
            <select
              name=""
              id=""
              value={explanationIndex}
              onChange={(e) => handleCourseChange(e.target.value, true)}
            >
              {explanation?.map((data, index) => (
                <option value={index} key={index}>
                  {data?.topic}
                </option>
              ))}
            </select>
            <i
              className="fa-light fa-chevron-right"
              onClick={handleChangeToNextTopic}
            ></i>
          </>
        )}
      </div>
      {isLoading && <PageLoader />}
      <QuestionBar isVisible={isQuestioning} onHide={handleHideQuestionBar} />
    </div>
  );
};

export default LecturePage;

const IntroductionScreen = ({
  projectTitle,
  isPlaying,
  handleSpaceBarClick,
  hasIntroduced,
}) => {
  return (
    <div className="introduction-screen">
      <p className="Introduction-big">A Brief Explanation On</p>
      <p className="Introduction-big">{projectTitle}</p>
      <div className="line"></div>
      <p className="Introduction-small">Lecture By Olivia</p>
      <button onClick={handleSpaceBarClick}>
        {!hasIntroduced && !isPlaying
          ? "Start Lecture"
          : !hasIntroduced && isPlaying
          ? "Skip Introduction"
          : hasIntroduced && !isPlaying
          ? "Continue Lecture"
          : "Stop Lecture"}
      </button>
    </div>
  );
};

const LectureScreen = ({
  explanation,
  isPlaying,
  handleSpaceBarClick,
  hasIntroduced,
  isQuestioning,
  handleAskQuestion,
  project,
  handleCompleteLecture,
  hasFinished,
}) => {
  const lectureRef = useRef(null);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (isPlaying) {
      lectureRef.current.scrollTop = 0;
    }
    if (isPlaying && isQuestioning) return;
    const interval = setInterval(() => {
      if (!isPlaying) {
      } else if (lectureRef.current && !isQuestioning) {
        lectureRef.current.scrollTop += 0.7; // Gradual scrolling
      }
    }, 150);

    return () => clearInterval(interval); // Cleanup to prevent memory leaks
  }, [isPlaying, isQuestioning]);

  return (
    <div className="lecture-screen fade">
      <div className="heading">
        <p className="heading-4">{explanation?.topic}</p>
        <div className="flex gap-4 ls-c">
          {/* <button>View Summary</button> */}
          <button onClick={handleSpaceBarClick}>
            {!hasIntroduced && !isPlaying
              ? "Start Lecture"
              : !hasIntroduced && isPlaying
              ? "Skip Introduction"
              : hasIntroduced && !isPlaying
              ? "Speak Lecture"
              : "Stop Speech"}
          </button>

          <button onClick={handleCompleteLecture}>Jump to Quiz</button>
        </div>
      </div>
      <div className="main-text-wrapper" ref={lectureRef}>
        <p>{explanation?.explanation}</p>
        <div className="hand-wrapper" onClick={handleAskQuestion}>
          <i className="fa-light fa-hand"></i>
        </div>
      </div>
    </div>
  );
};
