import React from "react";

const Slide = ({ children }) => {
 
  return (
    <div className="h-auto w-screen min-h-screen flex flex-col justify-center items-start text-left px-[200px]">
      {children}
    </div>
  );
};

export default Slide;
