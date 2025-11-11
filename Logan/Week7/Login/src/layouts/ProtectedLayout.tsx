import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSidebar } from "../hooks/useSidebar";
import Sidebar from "../components/Sidebar";

// layout은 왜쓰는걸까...
const ProtectedLayout = () => {
  const { isOpen, toggle, close } = useSidebar();

  const { accessToken } = useAuth();
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to={"/login"} state={{ location }} replace />; //replace: 히스토리에 남기지 않는다.
  }
  return (
    <div className="h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1  mt-10">
        <Outlet />
      </main>
      <Footer />
      <Sidebar isOpen={isOpen} onClose={close} />
    </div>
  );
};

export default ProtectedLayout;
