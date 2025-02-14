import React, { useState } from "react";
import DarkLogo from "../../assets/logo-black.png";
import LightLogo from "../../assets/logo-white.png";
import Button from "../Button/Button";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { navigation } from "../../site/navigation";
import useTheme from "../../hooks/useTheme";

const LoginComponent = ({ handleAuthTypeChange }) => {
  // Auth hook
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [userEntry, setUserEntry] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const { email, password } = userEntry;
      setIsLoading(true);
      if (!email || !password) return toast.error("incomplete Information");

      const userInformation = await login(userEntry);
      toast("Welcome back, " + userInformation.firstname);
      navigate(navigation.homePage.base);
    } catch (error) {
      console.error(error);
      if (error.message.includes("auth/invalid-credential")) {
        return toast.error("Wrong credentials");
      }
      toast.error("Error loging you in");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="RegistrationComponent fade">
      <div className="image-container">
        <img src={theme === "light" ? DarkLogo : LightLogo} alt="" />
      </div>
      <div className="page-text-cont">
        <p className="heading-3">Welcome back</p>
      </div>
      <div className="auth-type-cont">
        <div className="line"></div>
        <p className="small-text">Signup</p>
        <div className="line"></div>
      </div>
      <div className="auth-form-cont">
        {/*  */}
        {/* Email Password Section */}
        <input
          type="email"
          placeholder="Email"
          value={userEntry.email}
          onChange={(e) =>
            setUserEntry((p) => ({ ...p, email: e.target.value }))
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={userEntry.password}
          onChange={(e) =>
            setUserEntry((p) => ({ ...p, password: e.target.value }))
          }
        />
      </div>
      <div className="auth-action-cont">
        <Button text={"Login"} isLoading={isLoading} onClick={handleLogin} />
        <p className="small-text" onClick={handleAuthTypeChange}>
          Don't have an account?
          <br />
          Click here to signup
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
