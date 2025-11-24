import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogout } from '../hooks/mutations/useLogout';
import { useGetMyInfo } from '../hooks/queries/useGetMyInfo';
import { useSidebar } from '../hooks/useSidebar';
import { Sidebar } from './Sidebar';

export const NavBar = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { isOpen, toggle, close } = useSidebar();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  // React Query로 사용자 정보 조회
  const { data: myInfoResponse } = useGetMyInfo(accessToken);
  const userName = myInfoResponse?.data?.name;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        alert('로그아웃 되었습니다.');
        navigate('/');
      },
      onError: (error) => {
        console.error('로그아웃 실패:', error);
        alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  return (
    <nav className="bg-[#141517] border-b border-gray-800 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {accessToken && (
            <button
              onClick={toggle}
              className="text-gray-300 hover:text-pink-400 transition-colors p-2"
              aria-label="메뉴"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          <NavLink
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent hover:from-pink-400 hover:to-rose-400 transition-all"
          >
            DOLIGO
          </NavLink>
        </div>

        <ul className="flex items-center space-x-8">
          {accessToken ? (
            <>
              {userName && (
                <li className="text-gray-300">
                  {userName} 님 환영합니다
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-gray-300 hover:text-pink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
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

      {/* Sidebar 컴포넌트 */}
      {accessToken && <Sidebar isOpen={isOpen} onClose={close} />}
    </nav>
  );
}