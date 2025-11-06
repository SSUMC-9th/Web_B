import {useAuth} from '../context/AuthContext.tsx';
import {Navigate, Outlet} from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';

const ProtectedLayout = () => {
    const {accessToken} = useAuth();

    if (!accessToken) {
        return <Navigate to={'/login'} replace/>
    }

    return (
    <div className='h-dvh flex flex-col'>
        <Navbar/>
        <main className='flex-1 mt-10'>
            <Outlet/>
        </main>
        <Footer/>
    </div>
    )
}

export default ProtectedLayout;