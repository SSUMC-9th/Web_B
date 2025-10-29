import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to={"/login"} replace />; //replace: 히스토리에 남기지 않는다.
  }
  return <Outlet />;
};

export default ProtectedLayout;
