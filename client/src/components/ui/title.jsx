import React from "react";
import { cn } from "./cn";

const Title = ({ children, className }) => {
  return <h3 className={cn("font-semibold text-xl", className)}>{children}</h3>;
};

export default Title;
