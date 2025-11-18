import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AutoContext"

const ProtectedLayout = () => {
    const {accessToken} = useAuth();
    const location = useLocation();

    if(!accessToken){
        return <Navigate to = {"/"} state = {{location}} replace />;
    
    }
    
    return <Outlet/>
}

export default ProtectedLayout;