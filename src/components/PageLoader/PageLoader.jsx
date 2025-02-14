import React from 'react'
import "./PageLoader.css";
import Loader from "../../assets/loading.gif"

const PageLoader = () => {
  return <div className="PageLoader">
    <img src={Loader} alt="" />
  </div>;
}

export default PageLoader