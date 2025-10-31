import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const NavBar = () => {
  const { accessToken, logout } = useAuth();

  return (
    <nav className="bg-[#141517] border-b border-gray-800 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <NavLink
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent hover:from-pink-400 hover:to-rose-400 transition-all"
        >
          Spin the LP Record
        </NavLink>

        <ul className="flex items-center space-x-8">
          {accessToken ? (
            <>
              <li>
                <NavLink
                  to="/mypage"
                  className={({ isActive }) =>
                    isActive
                      ? 'text-pink-500 font-semibold transition-colors'
                      : 'text-gray-300 hover:text-pink-400 transition-colors'
                  }
                >
                  마이페이지
                </NavLink>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  로그아웃
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? 'text-pink-500 font-semibold transition-colors'
                      : 'text-gray-300 hover:text-pink-400 transition-colors'
                  }
                >
                  로그인
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive
                      ? 'text-pink-500 font-semibold transition-colors'
                      : 'text-gray-300 hover:text-pink-400 transition-colors'
                  }
                >
                  회원가입
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}