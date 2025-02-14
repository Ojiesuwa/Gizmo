import React, { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigation } from "../site/navigation";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";
import {
  accountListener,
  createNewUser,
  fetchUserbyId,
} from "../controllers/account";
import Loader from "../components/Loader/Loader";
import { use } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Hoooks
  const navigate = useNavigate();
  const location = useLocation();

  const [userCredential, setUserCredential] = useState(undefined);
  const [accountDetail, setAccountDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect hooks

  // Default action for various credential state
  useEffect(() => {
    if (userCredential === null) {
      navigate(navigation.authPage.base);
      setIsLoading(false);
    } else if (userCredential === undefined) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
    window.responsiveVoice.cancel();
  }, [location, userCredential]);

  // Observer for auth state
  useEffect(() => {
    onAuthStateChanged(auth, (user) => setUserCredential(user));
  }, []);

  // Fetch full user data when the user credential is updated
  useEffect(() => {
    if (!userCredential) return;
    accountListener(userCredential.uid, (data) => setAccountDetail(data));
  }, [userCredential]);

  const signup = ({
    firstname,
    lastname,
    email,
    username,
    password,
    school,
  }) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Get auth data from firebase
        const authData = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Create new user in the databse
        await createNewUser({
          firstname,
          username,
          lastname,
          email,
          school,
          uid: authData.user.uid,
        });

        // Locally update the user
        setUserCredential(authData.user);

        // Good bye MF
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  };
  const login = ({ email, password }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const authData = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const userData = await fetchUserbyId(authData.user.uid);

        setUserCredential(authData.user);
        resolve(userData);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  };
  const signout = () => {
    return new Promise((resolve, reject) => {
      try {
        signOut(auth);
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  };
  return (
    <AuthContext.Provider
      value={{ userCredential, accountDetail, signout, login, signup }}
    >
      {children}
      <Loader isVisible={isLoading} />
    </AuthContext.Provider>
  );
};

export default AuthContext;
