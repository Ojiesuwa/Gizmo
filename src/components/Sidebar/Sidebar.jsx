import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { navigation } from "../../site/navigation";
import AvatarImage from "../../assets/avatar.png";
import SideBarProjectPreview from "../SideBarProjectPreview/SideBarProjectPreview";
import Logo from "../../assets/logo-black.png";
import LogoW from "../../assets/logo-white.png";
import MiniLoader from "../MiniLoader/MiniLoader";
import { toast } from "react-toastify";
import {
  fetchAllProjectWithId,
  liveListenToUserProjects,
} from "../../controllers/projects";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userCredential, accountDetail } = useAuth() || {}; // Provides a fallback to avoid destructuring undefined

  const [isFull, setIsFull] = useState(!true);
  const [isMobile, setISMobile] = useState(window.innerWidth < 700);
  const [projects, setProjects] = useState(null);
  const [displayProjects, setDisplayProjects] = useState(null);
  const [search, setSearch] = useState("");

  const handleNewProject = () => {
    navigate(navigation.homePage.base);
    if (window.innerWidth < 800) return setIsFull(false);
  };

  const fetchAndUpdateProject = async () => {
    try {
      const projectsDb = await fetchAllProjectWithId(userCredential.uid);
      setProjects(projectsDb);
      setDisplayProjects(projectsDb);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching history");
    }
  };

  const handleSearchAction = (keyword) => {
    //console.log(projects);

    setDisplayProjects(
      projects?.filter((project) =>
        project?.title?.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  useEffect(() => {
    if (!userCredential) return;
    fetchAndUpdateProject();

    const unsubscribe = liveListenToUserProjects(
      userCredential?.uid,
      (data) => {
        setProjects(data);
        setDisplayProjects(data);
        //console.log(data);
      }
    );
    return () => unsubscribe();
  }, [userCredential]);

  useEffect(() => {
    handleSearchAction(search);
  }, [search]);

  if (location.pathname === navigation.authPage.base) return null;
  return (
    <div
      className={
        "sidebar-bigger-wrapper fade-right " +
        (isFull ? "full-bar" : isMobile ? "mobile-small-bar" : "small-bar")
      }
    >
      {isFull ? (
        <FullSideBar
          onShrinkBar={() => setIsFull(false)}
          handleNewProject={handleNewProject}
          projects={projects}
          displayProjects={displayProjects}
          search={search}
          setSearch={(e) => setSearch(e.target.value)}
          accountDetail={accountDetail}
        />
      ) : isMobile ? (
        <MobileBar onExpandBar={() => setIsFull(true)} />
      ) : (
        <SmallSideBar
          onExpandBar={() => setIsFull(true)}
          handleNewProject={handleNewProject}
          accountDetail={accountDetail}
        />
      )}
    </div>
  );
};

const MobileBar = ({ onExpandBar }) => {
  const { theme } = useTheme();
  return (
    <div className="MobileBar fade">
      <i
        className="fa-light fa-sidebar-flip sidebar-toggle"
        onClick={onExpandBar}
      ></i>
      <img src={theme === "light" ? Logo : LogoW} alt="" />
      <p className="heading-4">Gizmo</p>
    </div>
  );
};

const FullSideBar = ({
  onShrinkBar,
  handleNewProject,
  projects,
  displayProjects,
  search,
  setSearch,
  accountDetail,
}) => {
  const navigate = useNavigate();

  return (
    <div className="Sidebar fade">
      <div className="top-wrapper">
        <div className="side-logo-cont">
          {/* <img src={Logo} alt="" /> */}
          <p className="heading-4">Gizmo</p>
          <div className="flex gap-3">
            <i
              className="fa-light fa-pen-to-square"
              title="New Quiz Project"
              onClick={handleNewProject}
            ></i>
            <i
              className="fa-light fa-sidebar-flip sidebar-toggle"
              onClick={onShrinkBar}
              title="Toggle Sidebar"
            ></i>
          </div>
        </div>
        <div className="search-cont">
          <div className="input-wrapper">
            <i className="fa-light fa-search"></i>
            <input
              type="text"
              placeholder="Search Projects"
              value={search}
              onChange={setSearch}
            />
          </div>
        </div>
        <div className="line sidebar-dem"></div>
        {projects === null ? (
          <MiniLoader />
        ) : (
          <div className="project-cont">
            {displayProjects.length === 0 && (
              <p style={{ fontSize: 13, fontStyle: "italic" }}>
                No project Yet
              </p>
            )}
            {displayProjects.map((project, index) => (
              <SideBarProjectPreview
                key={index}
                title={project?.title}
                createdAt={project?.createdAt}
                onClick={() => {
                  navigate(navigation.quizDashboard.base + "/" + project.docId);
                  if (window.innerWidth < 700) onShrinkBar();
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="bottom-wrapper">
        <div className="control-cont flex justify-between">
          <div
            className="HoverIcon"
            title="Project History"
            onClick={() => {
              if (window.innerWidth < 700) onShrinkBar();
              navigate(navigation.projectListPage.base);
            }}
          >
            <i className="fa-light fa-rectangle-history"></i>
          </div>
          <div
            className="HoverIcon"
            title="Fund Wallet"
            onClick={() => {
              if (window.innerWidth < 700) onShrinkBar();
              navigate(navigation.walletPage.base);
            }}
          >
            <i className="fa-light fa-money-bill"></i>
          </div>
          <div
            className="HoverIcon"
            title="Leader Board"
            onClick={() => {
              if (window.innerWidth < 700) onShrinkBar();
              navigate(navigation.leaderBoardPage.base);
            }}
          >
            <i className="fa-light fa-trophy"></i>
          </div>
          <div
            className="HoverIcon"
            title="Talk to us"
            onClick={() => {
              if (window.innerWidth < 700) onShrinkBar();
              navigate(navigation.complaintPage.base);
            }}
          >
            <i className="fa-light fa-message"></i>
          </div>
        </div>
        <div
          className="account-cont"
          onClick={() => {
            if (window.innerWidth < 700) onShrinkBar();
            navigate(navigation.accountPage.base);
          }}
        >
          <img src={AvatarImage} alt="" />
          <div className="account-text-wrapper">
            <p className="acc-username">{accountDetail?.username}</p>
            <div className="flex gap-2 items-center">
              <p className="xp-title" style={{ wordWrap: "break-word" }}>
                {accountDetail?.xp < 2000
                  ? "Rookie"
                  : accountDetail?.xp < 7000
                  ? "Scholar"
                  : accountDetail?.xp < 20000
                  ? "Pro"
                  : "Legendary"}
              </p>
              <p className="acc-xp">
                {accountDetail?.xp.toLocaleString("fr-FR") || 0}xp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SmallSideBar = ({ onExpandBar, handleNewProject, accountDetail }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  return (
    <div className="SmallSideBar fade">
      <div className="logo-cont">
        <img src={theme === "light" ? Logo : LogoW} alt="" />
      </div>
      <div
        className="toggle-bar mt-4 toggle-side-bar shrink-0"
        onClick={onExpandBar}
        title="Toggle Sidebar"
      >
        <i className="fa-light fa-sidebar-flip sidebar-toggle"></i>
      </div>

      <div className="main-control-cont">
        <div className="HoverIcon darker-v" title="Quiz Projects">
          <i
            className="fa-light fa-pen-to-square"
            title="New Quiz Project"
            onClick={handleNewProject}
          ></i>
        </div>
        <div
          className="HoverIcon darker-v"
          title="Project History"
          onClick={() => {
            // if (window.innerWidth < 700) onShrinkBar();
            navigate(navigation.projectListPage.base);
          }}
        >
          <i className="fa-light fa-rectangle-history"></i>
        </div>
        <div
          className="HoverIcon darker-v"
          title="Fund Wallet"
          onClick={() => navigate(navigation.walletPage.base)}
        >
          <i className="fa-light fa-money-bill"></i>
        </div>
        <div
          className="HoverIcon darker-v"
          title="Leader Board"
          onClick={() => {
            // if (window.innerWidth < 700) onShrinkBar();
            navigate(navigation.leaderBoardPage.base);
          }}
        >
          <i className="fa-light fa-trophy"></i>
        </div>
        <div
          className="HoverIcon darker-v"
          title="Talk to us"
          onClick={() => {
            // if (window.innerWidth < 700) onShrinkBar();
            navigate(navigation.complaintPage.base);
          }}
        >
          <i className="fa-light fa-message"></i>
        </div>
      </div>

      <div
        className="account-cont flex flex-col gap-3 align-center"
        onClick={() => {
          // if (window.innerWidth < 700) onShrinkBar();
          navigate(navigation.accountPage.base);
        }}
      >
        <img src={AvatarImage} alt="" />
        <p className="acc-xp">{accountDetail?.xp.toLocaleString("fr-FR")}xp</p>
        {/* <p className="acc-xp">N2000</p> */}
      </div>
    </div>
  );
};

export default Sidebar;
