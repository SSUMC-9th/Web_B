import {useAuth} from '../context/AuthContext.tsx';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import {useEffect, useRef} from 'react';

const ProtectedLayout = () => {
    const {accessToken} = useAuth();
    const didAlert = useRef(false);
    const location = useLocation();

    useEffect(() => {
        if (!accessToken && !didAlert.current) {
        didAlert.current = true; // 다시 뜨지 않게 막음
        alert('로그인이 필요한 서비스입니다. 로그인 해주세요!');
        }
    }, [accessToken]);

    if (!accessToken) {
        // 로그인 안 한 상태에서 '/' 접근 시도 후 로그인 성공 시 경로
        return <Navigate to={'/login'} replace state={{from: location}} />
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