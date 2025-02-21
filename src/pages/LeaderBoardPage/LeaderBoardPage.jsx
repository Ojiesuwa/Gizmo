import React, { useEffect, useState } from "react";
import "./LeaderBoardPage.css";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { fetchUserRanking } from "../../controllers/account";
import PageLoader from "../../components/PageLoader/PageLoader";
import { useNavigate } from "react-router-dom";
import { navigation } from "../../site/navigation";

const LeaderBoardPage = () => {
  // Hooks
  const { userCredential, accountDetail } = useAuth() || {};
  const navigate = useNavigate();

  const [ranking, setRanking] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndUpdateRanking = async () => {
    try {
      setIsLoading(true);
      const rankingDb = await fetchUserRanking(
        userCredential?.uid,
        accountDetail?.school,
        accountDetail
      );
      setRanking(rankingDb);
    } catch (error) {
      console.error(error);
      toast.error("Error ranking ");
      navigate(navigation.quizDashboard.base);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userCredential || !accountDetail) return;
    fetchAndUpdateRanking();
  }, [userCredential, accountDetail]);

  useEffect(() => {
    document.title = "Leaderboard";
  }, []);
  return (
    <div className="LeaderBoardPage">
      <p className="big-text">{accountDetail?.school} Leaderboard</p>
      <div className="leader-board">
        <div className="title">
          <div className="board-item">
            <p className="name-cont">Username</p>
            <p className="ranking-cont">Rank</p>
            <p className="xp-cont">XP</p>
            <p className="level-cont">Level</p>
          </div>
        </div>
        <div className="main">
          {ranking?.map((data, index) => (
            <div className="board-item" key={index}>
              <p className="name-cont">{data?.username}</p>
              <p className="ranking-cont">{data?.rank}</p>
              <p className="xp-cont">{data?.xp}</p>
              <p className="level-cont">
                {data?.xp < 2000
                  ? "Rookie"
                  : accountDetail?.xp < 7000
                  ? "Scholar"
                  : accountDetail?.xp < 20000
                  ? "Pro"
                  : "Legendary"}
              </p>
            </div>
          ))}
        </div>
      </div>
      {isLoading && <PageLoader />}
    </div>
  );
};

export default LeaderBoardPage;
