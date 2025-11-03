import React from "react";
import bgImg from "../assets/bgbgmi.jpg"; // path sahi rakhna

const BgBGMI = ({ children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    >
      {children}
    </div>
  );
};

export default BgBGMI;