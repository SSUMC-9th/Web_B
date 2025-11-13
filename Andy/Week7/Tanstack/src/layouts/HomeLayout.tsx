import { Outlet } from "react-router-dom";
import { NavBar } from "../components/NavBar.tsx";

const HomeLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default HomeLayout;
