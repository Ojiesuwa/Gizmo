import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { navigation } from "./site/navigation";
import { AuthProvider } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage/AuthPage";
import { Flip, ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar/Sidebar";
import CreateQuizPage from "./pages/CreateQuizPage/CreateQuizPage";
import QuizDashboard from "./pages/QuizDashboard/QuizDashboard";
import LecturePage from "./pages/LecturePage/LecturePage";
import QuizViewPage from "./pages/QuizViewPage/QuizViewPage";
import GradingPage from "./pages/GradingPage/GradingPage";
import WalletPage from "./pages/WalletPage/WalletPage";
import ProjectListPage from "./pages/ProjectListPage/ProjectListPage";
import UnderDevelopmentPage from "./pages/UnderDevelopmentPage/UnderDevelopmentPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import ComplaintPage from "./pages/ComplaintPage/ComplaintPage";
import LeaderBoardPage from "./pages/LeaderBoardPage/LeaderBoardPage";
import { useEffect } from "react";
import promptChatGpt from "./components/promptChatGpt";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Sidebar />
          <Routes>
            <Route path="*" element={<UnderDevelopmentPage />} />
            <Route path={navigation.authPage.dynamic} element={<AuthPage />} />
            <Route
              path={navigation.quizDashboard.dynamic}
              element={<QuizDashboard />}
            />
            <Route
              path={navigation.homePage.dynamic}
              element={<CreateQuizPage />}
            />
            <Route
              path={navigation.leaderBoardPage.dynamic}
              element={<LeaderBoardPage />}
            />
            <Route
              path={navigation.lecturePage.dynamic}
              element={<LecturePage />}
            />
            <Route
              path={navigation.quizViewPage.dynamic}
              element={<QuizViewPage />}
            />
            <Route
              path={navigation.gradingPage.dynamic}
              element={<GradingPage />}
            />
            <Route
              path={navigation.walletPage.dynamic}
              element={<WalletPage />}
            />
            <Route
              path={navigation.projectListPage.dynamic}
              element={<ProjectListPage />}
            />
            <Route
              path={navigation.accountPage.dynamic}
              element={<AccountPage />}
            />
            <Route
              path={navigation.complaintPage.dynamic}
              element={<ComplaintPage />}
            />
          </Routes>
          <ToastContainer
            position={"top-center"}
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
