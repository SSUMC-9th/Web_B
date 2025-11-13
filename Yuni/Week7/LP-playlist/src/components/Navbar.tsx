import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useLogout from '../hooks/mutations/useLogout';
import HamburgerIcon from '../assets/icons/hamburger-button.svg?react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { isAuthenticated, user } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <header className="flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-gray-800">
      {/* 버거 메뉴 버튼 */}
      <button
        onClick={onToggleSidebar}
        className="text-white hover:text-pink-500 transition p-2"
        aria-label="메뉴"
      >
        <HamburgerIcon className="w-6 h-6" />
      </button>

      {/* 로고 */}
      <Link to="/" className="text-2xl font-bold text-pink-500 hover:text-pink-400 transition flex-1">
        돌려돌려 LP판
      </Link>

      {/* 우측 메뉴 */}
      <div className="flex gap-3 items-center">
        {isAuthenticated && user ? (
          <>
            <span className="text-gray-300 text-sm hidden md:inline">
              {user.name || user.email}님 반갑습니다.
              {user.role === 'admin' && <span className="ml-2 text-yellow-500">[관리자]</span>}
            </span>
            <button
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="px-4 py-2 rounded hover:text-pink-500 transition text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded hover:text-pink-500 transition text-white hidden sm:inline-block"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded hover:text-pink-500 transition text-white"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
}