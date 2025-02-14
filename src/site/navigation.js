import ComplaintPage from "../pages/ComplaintPage/ComplaintPage";

export const navigation = {
  homePage: {
    base: "/",
    dynamic: "/",
  },
  authPage: {
    base: "/auth",
    dynamic: "/auth",
  },
  createQuizPage: {
    base: "quiz/create",
    dynamic: "quiz/create",
  },
  quizDashboard: {
    base: "/quiz/dashboard",
    dynamic: "/quiz/dashboard/:id",
  },
  lecturePage: {
    base: "/quiz/lecture",
    dynamic: "/quiz/lecture/:projectId/:lectureId",
  },
  quizViewPage: {
    base: "/quiz/view",
    dynamic: "/quiz/view/:projectId/:quizId",
  },
  gradingPage: {
    base: "/quiz/grade",
    dynamic: "/quiz/grade/:projectId/:quizId",
  },
  walletPage: {
    base: "/wallet",
    dynamic: "/wallet",
  },
  projectListPage: {
    base: "/projects",
    dynamic: "/projects",
  },
  leaderBoardPage: {
    base: "/leaderboard",
    dynamic: "/leaderboard",
  },
  accountPage: {
    base: "/account",
    dynamic: "/account",
  },
  complaintPage: {
    base: "/complaint",
    dynamic: "/complaint",
  },
};
