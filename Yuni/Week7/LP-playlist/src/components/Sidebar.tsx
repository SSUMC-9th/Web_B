import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sidebar 컴포넌트
 * - 데스크톱(lg 이상)에서는 항상 표시
 * - 모바일(lg 미만)에서는 isOpen 상태에 따라 표시/숨김
 * - 외부 클릭 시 onClose 콜백 실행
 */
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { isAuthenticated } = useAuth();

  // 배경 클릭 시 사이드바 닫기
  const handleBackdropClick = () => {
    onClose();
  };

  return (
    <>
      {/* 모바일에서 사이드바 열렸을 때의 배경 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`
          fixed
          top-16 left-0 h-[calc(100vh-64px)]
          w-64 bg-gray-900 border-r border-gray-800
          transform transition-transform duration-300 ease-in-out
          z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          overflow-y-auto
        `}
      >
        <nav className="flex flex-col h-full p-4">
          {/* 네비게이션 메뉴 */}
          <nav className="flex-1">
            {isAuthenticated ? (
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
                    onClick={onClose}
                  >
                    홈
                  </Link>
                </li>
                <li>
                  <Link
                    to="/protected/dashboard"
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
                    onClick={onClose}
                  >
                    마이페이지
                  </Link>
                </li>
                <li>
                  <Link
                    to="/protected/search"
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
                    onClick={onClose}
                  >
                    검색
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
                    onClick={onClose}
                  >
                    홈
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
                    onClick={onClose}
                  >
                    로그인
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
                    onClick={onClose}
                  >
                  회원가입
                  </Link>
                </li>
              </ul>
            )}
          </nav>

          {/* 푸터 정보 */}
          <div className="border-t border-gray-800 pt-4 text-xs text-gray-500">
            <p>© 2024 LP판</p>
            <p>All rights reserved</p>
          </div>
        </nav>
      </aside>
    </>
  );
}
