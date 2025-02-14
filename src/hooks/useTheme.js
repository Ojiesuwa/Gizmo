import React, { useEffect, useState } from "react";
import { setAccountTheme } from "../controllers/account";
import useAuth from "./useAuth";
import { toast } from "react-toastify";

const useTheme = () => {
  const { userCredential, accountDetail } = useAuth() || {};
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") === undefined
      ? "dark"
      : localStorage.getItem("theme")
  );

  useEffect(() => {
    if (!userCredential) return;
    setTheme(accountDetail?.theme);
    localStorage.setItem("theme", accountDetail?.theme || "light");
  }, [accountDetail]);

  useEffect(() => {
    const root = document.documentElement;
    const themeVariables = [
      { variable: "--background-color", light: "#fff", dark: "#121212" },
      { variable: "--text-color", light: "#222", dark: "#ddd" },
      {
        variable: "--toastify-color-progress-dark",
        light: "green",
        dark: "#4caf50",
      },
      { variable: "--reset-btn-bg", light: "#555", dark: "#bbb" },
      { variable: "--stroke-color", light: "#aaa", dark: "#555" },
      { variable: "--sidebar-background", light: "#f8f8f8", dark: "#1e1e1e" },
      { variable: "--button-color", light: "#222", dark: "#ddd" },
    ];

    themeVariables.forEach(({ variable, light, dark }) => {
      root.style.setProperty(variable, theme === "dark" ? dark : light);
    });
  }, [theme]);

  const changeTheme = async (inTheme) => {
    try {
      if (inTheme !== "light" && inTheme !== "dark") return;
      setTheme(inTheme);

      await setAccountTheme(userCredential?.uid, inTheme);
    } catch (error) {
      console.error(error);
      toast.error("Error saving theme to account");
    }
  };

  return { theme, changeTheme };
};

export default useTheme;
