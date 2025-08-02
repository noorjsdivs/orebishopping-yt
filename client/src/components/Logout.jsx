import React from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    toast.success("log out successfully");
    navigate("/");
  };
  return (
    <Button onClick={handleLogout} className="px-8 py-2.5">
      Logout
    </Button>
  );
};

export default Logout;
