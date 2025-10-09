import {NavBar} from "../components/NavBar.tsx";
import {Outlet} from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <Outlet />
    </div>
  )
}

export default HomePage;