import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.tsx';
import { HamburgerButton } from './HamburgerButton.tsx';

const Navbar = () => {
    const {accessToken, userName} = useAuth();

    return (
    <nav className='bg-white dark:bg-gray-900 shadow-md fixed w-full z-10'>
        <div className='flex items-center justify-between p-4'>
            {/*<HamburgerButton />*/}
            <Link 
                to='/'
                className='text-xl font-bold text-gray-900 dark:text-white'
            >
                SpinningSpinning Dolimpan        
            </Link>
            <div className='space-x-6'>
                {!accessToken && (
                    <>
                    <Link
                    to={'/login'}
                    className='text-gray-700 dark:text-gray-300 hover:text-blue-500'
                    >
                        로그인
                    </Link>
                    <Link
                    to={'/signup'}
                    className='text-gray-700 dark:text-gray-300 hover:text-blue-500'
                    >
                      회원가입
                    </Link>
                </>
                )}
                {accessToken && (
                    <>
                    <span>{userName}님 반갑습니다.</span>
                <Link 
                to={'/my'}
                className='text-gray-700 dark:text-gray-300 hover:text-blue-500'
                >마이 페이지</Link>
                </>
                )}
                <Link 
                to={'/search'}
                className='text-gray-700 dark:text-gray-300 hover:text-blue-500'
                >검색 페이지</Link>
            </div>
        </div>
    </nav>
    );
}

export default Navbar;
