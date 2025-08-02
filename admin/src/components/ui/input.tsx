import React from "react";
import { cn } from "./cn";

export const Label = ({ htmlFor, children, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("text-sm font-semibold tracking-wide", className)}
    >
      {children}
    </label>
  );
};

const Input = ({ type, className, placeholder, id, name, onChange, value }) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={onChange}
      className={cn(
        "border px-4 py-1 border-gray-500 rounded-md max-w-lg",
        className
      )}
      value={value}
    />
  );
};

export default Input;
