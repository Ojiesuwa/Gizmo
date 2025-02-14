import React, { useEffect, useState } from "react";
import "./AccountPage.css";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";
import { navigation } from "../../site/navigation";
import { useNavigate } from "react-router-dom";
import { addNewSchool, fetchAllSchools } from "../../controllers/site";
import { toast } from "react-toastify";
import { updateAccount } from "../../controllers/account";
import Button from "../../components/Button/Button";

const AccountPage = () => {
  const { theme, changeTheme } = useTheme();
  const { userCredential, accountDetail, signout } = useAuth();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    school: "",
    email: "",
  });
  const [allSchools, setAllSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async () => {
    try {
      setIsLoading(true);
      let payload = { ...formData };
      if (payload.school === "others") {
        await addNewSchool(payload.customSchool);
        console.log(payload);

        payload.school = payload.customSchool;
        delete payload.customSchool;
      }
      await updateAccount(userCredential?.uid, payload);
      toast.success("Account update successful");
    } catch (error) {
      console.error(error);
      toast.error("Error saving information");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!accountDetail) return;

    setFormData({ ...accountDetail });
    fetchAllSchools().then((data) => setAllSchools(data.schools));
  }, [accountDetail]);

  return (
    <div className="AccountPage">
      <div className="header fade-down">
        <p className="heading-3">Account</p>
        <div className="theme-cont">
          <b>Theme: </b>
          <select
            name=""
            id=""
            value={theme}
            onChange={(e) => {
              changeTheme(e.target.value);
            }}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
      </div>
      <div className="display-cont fade-up">
        <div className="left">
          <p className="lastname disp-name">{accountDetail?.lastname}</p>
          <p className="firstname disp-name">{accountDetail?.firstname}</p>
          <p className="disp-email">{accountDetail?.email}</p>
          <p className="disp-user">
            <b>Username:</b> {accountDetail?.username}
          </p>
        </div>
        <div className="right">
          <div className="info-cont">
            <b>School</b>
            <p>{accountDetail?.school}</p>
          </div>
          <div className="info-cont">
            <b>Wallet</b>
            <p>N {accountDetail?.wallet.toLocaleString("fr-FR")}</p>
          </div>
          <div className="info-cont">
            <b>XP</b>
            <p>{accountDetail?.xp.toLocaleString("fr-FR")} XP</p>
          </div>
        </div>
      </div>
      <div className="seperator fade-up ">
        <p className="heading-3 shrink-0">Modify Account</p>
        <Button
          text={"Save Changes"}
          isLoading={isLoading}
          loadingText={"Updating"}
          onClick={handleFormSubmit}
          disabled={formData.school === "others" && !formData.customSchool}
        />
      </div>
      <div className="form-container fade-up">
        <div className="form-wrapper">
          <b>Lastname</b>
          <input
            type="text"
            placeholder="Enter lastname"
            value={formData.lastname}
            onChange={(e) =>
              setFormData({ ...formData, lastname: e.target.value })
            }
          />
        </div>
        <div className="form-wrapper">
          <b>Firstname</b>
          <input
            type="text"
            placeholder="Enter firstname"
            value={formData.firstname}
            onChange={(e) =>
              setFormData({ ...formData, firstname: e.target.value })
            }
          />
        </div>
        <div className="form-wrapper ">
          <b>Username</b>
          <input
            type="text"
            placeholder="Enter username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>
        <div className="form-wrapper">
          <b>Email</b>
          <input
            type="text"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="form-wrapper">
          <b>School</b>
          <select
            name=""
            id=""
            value={formData.school}
            onChange={(e) =>
              setFormData((p) => ({ ...p, school: e.target.value }))
            }
          >
            <option value="" disabled selected>
              Select School
            </option>
            {allSchools.map((data, index) => (
              <option value={data} key={index}>
                {data}
              </option>
            ))}
            <option value="others">others</option>
          </select>
        </div>
        {formData.school === "others" && (
          <div className="form-wrapper">
            <b>Custom School</b>
            <input
              type="text"
              placeholder="Enter new school"
              value={formData.customSchool}
              onChange={(e) =>
                setFormData({ ...formData, customSchool: e.target.value })
              }
            />
          </div>
        )}
      </div>

      <div className="footer-cont fade-up">
        <button onClick={() => navigate(navigation.walletPage.base)}>
          Fund Wallet <i className="fa-light fa-money-bill"></i>
        </button>
        <button onClick={signout}>
          Signout <i className="fa-light fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
