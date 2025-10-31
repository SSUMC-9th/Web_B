import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900">
      <h1 className="text-2xl font-bold text-pink-500">돌려돌려 LP판</h1>
      <div className="flex gap-3 items-center">
        {isAuthenticated && user ? (
          <>
            <span className="text-gray-300 text-sm">
              {user.name || user.email}
              {user.role === 'admin' && <span className="ml-2 text-yellow-500">[관리자]</span>}
            </span>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-pink-500 rounded hover:bg-pink-600 transition"
            >
              대시보드
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition"
            >
              로그인
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 bg-pink-500 rounded hover:bg-pink-600 transition"
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </header>
  );
};