import React from "react";
import "./Button.css";
import Loading from "../../assets/loading.gif";
const Button = ({
  type,
  isLoading,
  text,
  loadingText,
  onClick,
  className,
  disabled,
}) => {
  if (!isLoading)
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`Button ${className}`}
      >
        {text}
      </button>
    );
  else
    return (
      <button className={`loading-btn ${className}`}>
        <img src={Loading} alt="" />
        {loadingText}
      </button>
    );
};

export default Button;
