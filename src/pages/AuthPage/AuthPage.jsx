import React, { useEffect, useState } from "react";
import "./AuthPage.css";
import LoginComponent from "../../components/LoginComponent/LoginComponent";
import SignupComponent from "../../components/SignupComponent/SignupComponent";
const AuthPage = () => {
  const [authType, setAuthType] = useState(true);

  useEffect(() => {
    document.title = "Registration";
  }, []);
  return (
    <div className="AuthPage drop-animation">
      {authType ? (
        <LoginComponent handleAuthTypeChange={() => setAuthType(false)} />
      ) : (
        <SignupComponent handleAuthTypeChange={() => setAuthType(true)} />
      )}
    </div>
  );
};

export default AuthPage;
