import React from "react";
import { logo } from "../assets/images";

const MainLoader = () => {
  return (
    <div className="w-full min-h-screen absolute top-0 left-0 bg-white flex flex-col gap-2 items-center justify-center z-50">
      <div className="w-52 p-4 rounded-lg bg-amazonBlue flex items-center justify-center relative">
        <img src={logo} alt="Logo" className="w-28 h-auto object-contain" />
      </div>

      <span className="w-14 h-14 inline-flex border-8 border-gray-300 rounded-full relative">
        <span className="w-14 h-14 border-8 border-r-orange-500 border-transparent rounded-full absolute -top-2 -left-2 animate-spin" />
      </span>
      <p className="text-xl text-center font-semibold text-slate-600 tracking-wide">
        Orebi shopping is loading...
      </p>
    </div>
  );
};

export default MainLoader;
