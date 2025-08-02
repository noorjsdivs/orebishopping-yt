import React from "react";
import { cn } from "./cn";

const Title = ({ children, className }) => {
  return (
    <h2 className={cn("text-2xl font-semibold tracking-wide", className)}>
      {children}
    </h2>
  );
};

export default Title;
