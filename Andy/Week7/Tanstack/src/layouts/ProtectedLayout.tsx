import {useAuth} from "../context/AuthContext.tsx";
import {Navigate, Outlet} from "react-router-dom";
import { NavBar } from "../components/NavBar.tsx";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to={"/login"} replace />;
  }

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default ProtectedLayout;