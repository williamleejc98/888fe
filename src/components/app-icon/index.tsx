import React from "react";

export const AppIcon: React.FC<{ size?: string }> = ({ size = "50px" }) => {
  const imgStyle = {
    width: size,
    height: "auto", // Maintain aspect ratio
  };

  return <img src="/888logo.png" style={imgStyle} alt="App Logo" />;
};