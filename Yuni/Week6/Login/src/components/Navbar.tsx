import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-gray-800">
      {/* 버거 메뉴 버튼 */}
      <button
        onClick={onToggleSidebar}
        className="text-white hover:text-pink-500 transition p-2"
        aria-label="메뉴"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M7.95 11.95h32m-32 12h32m-32 12h32"
          />
        </svg>
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
              {user.name || user.email}
              {user.role === 'admin' && <span className="ml-2 text-yellow-500">[관리자]</span>}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition text-white"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition text-white hidden sm:inline-block"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-pink-500 rounded hover:bg-pink-600 transition text-white"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
}