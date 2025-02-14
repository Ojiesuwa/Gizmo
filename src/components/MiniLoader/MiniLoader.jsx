import React from 'react'
import "./MiniLoader.css";
import Loader from "../../assets/loading.gif"

const MiniLoader = () => {
  return <div className="MiniLoader">
    <img src={Loader} alt="" />
  </div>;
}

export default MiniLoader