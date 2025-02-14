import React, { useEffect, useState } from "react";
import "./CreateQuizPage.css";
import Logo from "../../assets/logo-black.png";
import LogoW from "../../assets/logo-white.png";

import Timer from "../../components/Timer/Timer";
import { toast } from "react-toastify";
import { fetchLocalPDF } from "../../utils/localFiles";
import Button from "../../components/Button/Button";
import {
  createNewProject,
  validateProjectName,
} from "../../controllers/projects";
import { useNavigate } from "react-router-dom";
import { navigation } from "../../site/navigation";
import useAuth from "../../hooks/useAuth";
import { getPdfPages } from "../../utils/pdfExtractor";
import CreateProjectModal from "../../components/CreateProjectModal/CreateProjectModal";
import {
  debitAccountWallet,
  increaseAccountXp,
} from "../../controllers/account";
import { calculateTimeFromExpectedDuration } from "../../utils/timer";
import useTheme from "../../hooks/useTheme";

const CreateQuizPage = () => {
  // Hooks
  const navigate = useNavigate();
  const { userCredential } = useAuth() || {};
  const { theme } = useTheme();

  const [addedFile, setAddedFile] = useState(null);
  const [projectParameter, setProjectParameter] = useState({
    title: "",
    numberOfQuestions: 20,
    start: 1,
    end: 0,
    explanation: true,
    timer: false,
    submitOnTimeElapse: false,
    expectedDuration: {
      hours: 0,
      minutes: 1,
      seconds: 0,
    },
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [canGenerate, setCanGenerate] = useState(true);
  const [pdfPages, setPdfPages] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);

  //console.log(projectParameter);

  const handleAddPdf = async () => {
    try {
      const pdfBlob = await fetchLocalPDF();
      const pdfPagesD = await getPdfPages(pdfBlob);
      setAddedFile(pdfBlob);
      setPdfPages(pdfPagesD);
      setProjectParameter((p) => ({ ...p, end: pdfPagesD }));
    } catch (error) {
      console.error(error);
      toast.error("Error adding pdf");
    }
  };

  const validateProjectParameters = (projectParameter) => {
    // Check for title and n quetions
    if (projectParameter.title && projectParameter.numberOfQuestions)
      return true;

    return false;
  };

  const generateNewProject = async (xp, cost) => {
    try {
      if (!userCredential.uid) return;
      setIsGenerating(true);
      if (!validateProjectParameters(projectParameter))
        return toast.error("Suppy all required information");

      const isProjectTitleValid = await validateProjectName(
        projectParameter.title,
        userCredential?.uid
      );

      if (!isProjectTitleValid) {
        return toast.error("Project with name already exist");
      }
      const projectId = await createNewProject(
        projectParameter,
        addedFile,
        userCredential.uid
      );
      await debitAccountWallet(userCredential?.uid, cost);
      await increaseAccountXp(userCredential?.uid, xp);

      navigate(navigation.quizDashboard.base + "/" + projectId);
      
    } catch (error) {
      console.error(error);
      if (error.message.includes("small-text")) {
        return toast.error("Could not extract text");
      }
      toast.error("Error creating project");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSetPdfStartPage = (e) => {
    const value = e.target.value;

    if (value > pdfPages - 2) {
      setProjectParameter((p) => ({
        ...p,
        start: 1,
      }));
      return toast.error("Value higher than number of pages");
    }
    setProjectParameter((p) => ({
      ...p,
      start: value,
    }));
  };

  const handleSetPdfEndPage = (e) => {
    const value = e.target.value;
    if (value > pdfPages) {
      setProjectParameter((p) => ({
        ...p,
        end: pdfPages,
      }));
      return toast.error("Value higher than number of pages");
    }

    if (value <= projectParameter.start) {
      toast.error("End page can not be less than start page");
      return setProjectParameter((p) => ({
        ...p,
        end: value,
      }));
    }

    setProjectParameter((p) => ({
      ...p,
      end: value,
    }));
  };

  const handleVerifyName = async () => {
    try {
      setIsNameValid(undefined);

      const flag = await validateProjectName(
        projectParameter?.title,
        userCredential?.uid
      );

      //console.log(flag);

      if (!flag) {
        toast.error("Project with name already exist");
        return setIsNameValid(false);
      }

      setIsNameValid(true);
    } catch (error) {
      setIsNameValid(false);
    } finally {
    }
  };

  useEffect(() => {
    document.title = "Create Project";
  }, []);

  useEffect(() => {
    // const expectedTime = calculateTimeFromExpectedDuration(
    //   projectParameter?.expectedDuration
    // );
    // if (expectedTime === 0) {
    //   //console.log("reset to 0");
    //   setProjectParameter((p) => ({
    //     ...p,
    //     submitOnTimeElapse: false,
    //   }));
    // }
  }, [projectParameter]);
  return (
    <div
      className="CreateQuizPage"
      style={{ pointerEvents: !isGenerating ? "all" : "none" }}
    >
      <div
        className={
          "quiz-main-cont " + (addedFile ? "added-file" : "not-added-file")
        }
      >
        <div className="comp-name fade">
          <img src={theme === "light" ? Logo : LogoW} alt="" />
          <p>Gizmo</p>
        </div>
        <div className="phrase-cont fade">
          <p>
            Master your exams with ease, level up your knowledge, and dominate
            every test with Gizmo – your ultimate study companion!
            <br />
            🚀📚
          </p>
        </div>
        <button className="add-btn fade" onClick={handleAddPdf}>
          Add PDF File
          <i className="fa-regular fa-plus"></i>
        </button>

        {addedFile && (
          <>
            <div className="line fade-up"></div>
            <div className="form-cont fade-up">
              <div className="name-cont">
                <p className="heading-5">Quiz Title</p>
                <input
                  type="text"
                  className="mt-2"
                  placeholder="Enter title here..."
                  value={projectParameter.title}
                  onBlur={handleVerifyName}
                  onChange={(e) =>
                    setProjectParameter((p) => ({
                      ...p,
                      title: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="name-cont mt-5">
                <p className="heading-5">Start and stop page</p>
                <div className="flex gap-3">
                  <input
                    type="number"
                    className="mt-2"
                    placeholder="Enter title here..."
                    value={projectParameter.start}
                    onChange={handleSetPdfStartPage}
                    onBlur={() => {
                      if (
                        projectParameter.end < projectParameter.start ||
                        projectParameter.start > pdfPages ||
                        projectParameter.start < 1
                      ) {
                        setCanGenerate(false);
                      } else {
                        setCanGenerate(true);
                      }
                    }}
                  />
                  <input
                    type="number"
                    className="mt-2"
                    placeholder="Enter title here..."
                    value={projectParameter.end}
                    onChange={handleSetPdfEndPage}
                    onBlur={() => {
                      if (
                        projectParameter.end < projectParameter.start ||
                        projectParameter.end > pdfPages
                      ) {
                        setCanGenerate(false);
                      } else {
                        setCanGenerate(true);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="name-cont mt-5">
                <p className="heading-5">Number of Questions</p>
                <select
                  name=""
                  id=""
                  value={projectParameter.numberOfQuestions}
                  onChange={(e) =>
                    setProjectParameter((p) => ({
                      ...p,
                      numberOfQuestions: e.target.value,
                    }))
                  }
                >
                  <option value="" disabled selected>
                    Select number of question
                  </option>
                  <option value="10">20</option>
                  <option value="30">30</option>
                  {pdfPages > 20 && (
                    <>
                      <option value="40">40</option>
                      <option value="50">50</option>
                      <option value="60">60</option>
                    </>
                  )}
                  {pdfPages > 60 && (
                    <>
                      <option value="70">70</option>
                      <option value="80">80</option>
                      <option value="90">90</option>
                    </>
                  )}
                </select>
              </div>
              <div
                className="explanation-cont sub-cont"
                title="Get a summarized explanation to help you have a good understanding of your course."
              >
                <input
                  type="checkbox"
                  checked={projectParameter?.explanation}
                  onChange={(e) =>
                    setProjectParameter((p) => ({
                      ...p,
                      explanation: e.target.checked,
                    }))
                  }
                />
                <p className="">Generate Explantion</p>
              </div>
              <div className="timer-cont sub-cont" title="">
                <input
                  type="checkbox"
                  value={projectParameter?.timer}
                  onChange={(e) =>
                    setProjectParameter((p) => ({
                      ...p,
                      timer: e.target.checked,
                    }))
                  }
                />
                <p className="">Include Timer</p>
              </div>

              <div
                className={`timer-cont sub-cont ${
                  !(
                    projectParameter.timer &&
                    calculateTimeFromExpectedDuration(
                      projectParameter?.expectedDuration
                    ) > 0
                  )
                    ? "inactive-option"
                    : "active-option"
                }`}
                title=""
              >
                <input
                  type="checkbox"
                  value={projectParameter?.submitOnTimeElapse}
                  onChange={(e) =>
                    setProjectParameter((p) => ({
                      ...p,
                      submitOnTimeElapse: e.target.checked,
                    }))
                  }
                />
                <p className="">Automatically submit when time elapses</p>
              </div>

              {projectParameter?.timer && (
                <div className="time-input-cont mt-5">
                  <p className="heading-5">Make a timer limit</p>
                  <Timer
                    duration={projectParameter.expectedDuration}
                    setDuration={(duration) =>
                      setProjectParameter((p) => ({
                        ...p,
                        expectedDuration: duration,
                      }))
                    }
                  />
                </div>
              )}

              <Button
                text={"Generate Full Project"}
                isLoading={isNameValid === undefined}
                className={"gen-btn"}
                loadingText={"Verifying name"}
                onClick={() => {
                  if (
                    projectParameter?.timer &&
                    calculateTimeFromExpectedDuration(
                      projectParameter?.expectedDuration
                    ) === 0
                  ) {
                    return toast.error("Set appropraite timer limit");
                  }
                  setIsModalVisible(true);
                }}
                disabled={
                  !canGenerate || !projectParameter.title || !isNameValid
                }
              />
            </div>
          </>
        )}
      </div>
      <CreateProjectModal
        projectParameter={projectParameter}
        isVisible={isModalVisible}
        onHide={() => setIsModalVisible(false)}
        OnCreate={generateNewProject}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default CreateQuizPage;
