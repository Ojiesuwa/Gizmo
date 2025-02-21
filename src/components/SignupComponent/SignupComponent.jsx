import React, { useEffect, useState } from "react";
import DarkLogo from "../../assets/logo-black.png";
import LightLogo from "../../assets/logo-white.png";
import Button from "../Button/Button";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { navigation } from "../../site/navigation";
import { addNewSchool, fetchAllSchools } from "../../controllers/site";
import useTheme from "../../hooks/useTheme";
import SelectSchoolComponent from "../SelectSchoolComponent/SelectSchoolComponent";
import "./SignupComponent.css";

const SignupComponent = ({ handleAuthTypeChange }) => {
  // Auth hooks
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [allSchools, setAllSchools] = useState([]);
  const [userEntry, setUserEntry] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    school: undefined,
    customSchool: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      const {
        school,
        customSchool,
        firstname,
        username,
        lastname,
        email,
        password,
      } = userEntry;
      if (school === undefined) return toast.error("Select a school");
      if (school === "others" && !customSchool)
        return toast.error("Write your school's name");

      if (school === "others" && customSchool) await addNewSchool(customSchool);
      if (!firstname || !lastname || !email || !password)
        return toast.error("Enter complete information");

      await signup({
        firstname,
        lastname,
        email,
        username,
        password,
        school: school === "others" ? customSchool : school,
      });
      toast.success("Account Successfully created");
      toast.success("You have been gifted N300");
      return navigate(navigation.homePage.base);
    } catch (error) {
      console.error(error);
      if (error.message.includes("auth/email-already-in-use")) {
        return toast.error("Your account already exists");
      }
      toast.error("Error creating your account");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch all schools
  const handleFetchAllSchools = async () => {
    try {
      const data = await fetchAllSchools();
      setAllSchools(data.schools);

      // console.log$&
    } catch (error) {
      console.error(error);
      toast.error("Error fetching all schools");
    }
  };

  // Use efffect to fetch school names
  useEffect(() => {
    handleFetchAllSchools();
  }, []);
  return (
    <div className="SignupComponent RegistrationComponent fade">
      <div className="image-container">
        <img src={theme === "light" ? DarkLogo : LightLogo} alt="" />
      </div>
      <div className="page-text-cont">
        <p className="heading-3">Create new account</p>
      </div>
      <div className="auth-type-cont">
        <div className="line"></div>
        <p className="small-text">Signup</p>
        <div className="line"></div>
      </div>
      <div className="auth-form-cont">
        {/* Name section */}
        <div className="name-cont">
          <input
            type="text"
            placeholder="Firstname e.g John"
            value={userEntry.firstname}
            onChange={(e) =>
              setUserEntry((p) => ({ ...p, firstname: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Lastname e.g James"
            value={userEntry.lastname}
            onChange={(e) =>
              setUserEntry((p) => ({ ...p, lastname: e.target.value }))
            }
          />
        </div>
        <input
          type="text"
          placeholder="Username e.g JaJo1234"
          value={userEntry.username}
          onChange={(e) =>
            setUserEntry((p) => ({ ...p, username: e.target.value }))
          }
          className="mb-3"
        />
        {/*  */}

        {/* Email Password Section */}
        <input
          type="email"
          placeholder="Email e.g johnjames@gmail"
          value={userEntry.email}
          onChange={(e) =>
            setUserEntry((p) => ({ ...p, email: e.target.value }))
          }
        />

        <input
          type="password"
          placeholder="Password e.g AB122JU8"
          value={userEntry.password}
          onChange={(e) =>
            setUserEntry((p) => ({ ...p, password: e.target.value }))
          }
        />
        <div className="school-cont" onClick={() => setIsModalVisible(true)}>
          <p>{userEntry.school || "Click to select school"}</p>
          <i className="fa-light fa-school"></i>
        </div>
      </div>
      <div className="auth-action-cont">
        <Button text={"Signup"} onClick={handleSignup} isLoading={isLoading} />
        <p className="small-text" onClick={handleAuthTypeChange}>
          Already have an account?
          <br />
          Click here to login
        </p>
      </div>
      <SelectSchoolComponent
        isVisible={isModalVisible}
        onHide={() => setIsModalVisible(false)}
        onSelect={(school) => setUserEntry((p) => ({ ...p, school }))}
      />
    </div>
  );
};

export default SignupComponent;
