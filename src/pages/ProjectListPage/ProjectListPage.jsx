import React, { useEffect, useState } from "react";
import "./ProjectListPage.css";
import { toast } from "react-toastify";
import { fetchAllProjectWithId } from "../../controllers/projects";
import useAuth from "../../hooks/useAuth";
import PageLoader from "../../components/PageLoader/PageLoader";
import { formatDate } from "../../utils/date";
import { useNavigate } from "react-router-dom";
import { navigation } from "../../site/navigation";

const ProjectListPage = () => {
  const { userCredential } = useAuth();
  const [project, setProject] = useState(null);
  const [displayProject, setDisplayProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUpdateProjects = async () => {
    try {
      setIsLoading(true);
      const projectDb = await fetchAllProjectWithId(userCredential?.uid);
      setProject(projectDb);
      setDisplayProject(projectDb);
    } catch (error) {
      console.error(error);
      toast.error("Error loading projects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchAction = (keyword) => {
    //console.log(project);

    setDisplayProject(
      project?.filter((data) =>
        data?.title?.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  useEffect(() => {
    if (!userCredential) return;
    fetchUpdateProjects();
  }, [userCredential]);

  useEffect(() => {
    handleSearchAction(search);
  }, [search]);

  return (
    <div className="ProjectListPage">
      <div className="header flex justify-between items-center w-full">
        <p className="heading-3">Projects</p>

        <div className="search-cont">
          <div className="input-wrapper">
            <i className="fa-light fa-search"></i>
            <input
              type="text"
              placeholder="Search Projects"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      {!project ? (
        <>
          <p
            style={{
              fontStyle: "italic",
              textAlign: "center",
              marginTop: "200px",
            }}
          >
            No Project Available <br /> Create new project to see our awesome
            features
          </p>
        </>
      ) : (
        <div className="main-body fade-up">
          {displayProject?.map((data, index) => (
            <ProjectItem projectInformation={data} key={index} />
          ))}
        </div>
      )}
      {isLoading && <PageLoader />}
    </div>
  );
};

export default ProjectListPage;

const ProjectItem = ({ projectInformation }) => {
  const navigate = useNavigate();
  return (
    <div
      className="project-item"
      onClick={() => {
        navigate(
          navigation.quizDashboard.base + "/" + projectInformation?.docId
        );
      }}
    >
      <div className="name-cont">
        <p>{projectInformation?.title}</p>
      </div>
      <div className="date-cont">
        <p>{formatDate(projectInformation?.createdAt?.seconds)}</p>
      </div>
      <div className="number-cont">
        <p>{projectInformation?.numberOfQuestions} questions</p>
      </div>
      <div className="progress-cont">
        <p>Progress</p>
        <progress max={300} value={projectInformation?.progress}></progress>
      </div>
    </div>
  );
};
