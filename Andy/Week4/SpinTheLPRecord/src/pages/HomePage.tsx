import {NavBar} from "../components/NavBar.tsx";
import {Outlet} from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  )
}

export default HomePage;