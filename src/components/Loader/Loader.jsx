import React from "react";
import "./Loader.css";
import Logo from "../../assets/logo-black.png";
import LogoW from "../../assets/logo-white.png";
import useTheme from "../../hooks/useTheme";

const Loader = ({ isVisible }) => {
  const { theme } = useTheme();
  if (!isVisible) return null;
  return (
    <div className="Loader">
      <img
        src={theme === "light" ? Logo : LogoW}
        alt="/"
        className="anim-infinite-scale"
      />
    </div>
  );
};

export default Loader;
