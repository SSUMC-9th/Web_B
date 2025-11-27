import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  // ESC 키로 닫기 기능
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener('keydown', handleKeyDown);

    // 클린업 함수: 컴포넌트 언마운트 또는 의존성 변경 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // Sidebar가 열리면 body의 overflow를 hidden으로 설정
      document.body.style.overflow = 'hidden';
    } else {
      // Sidebar가 닫히면 원래대로 복원
      document.body.style.overflow = 'unset';
    }

    // 클린업 함수: 컴포넌트 언마운트 시 원래대로 복원
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay (배경): 클릭 시 Sidebar 닫기 */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1f2023] border-r border-gray-700 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="사이드바 메뉴"
      >
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              메뉴
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-pink-400 transition-colors p-2 rounded-lg hover:bg-gray-800"
              aria-label="사이드바 닫기"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 네비게이션 링크 */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/explore"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-pink-500/10 text-pink-500 font-semibold'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-pink-400'
                    }`
                  }
                >
                  찾기
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/mypage"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-pink-500/10 text-pink-500 font-semibold'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-pink-400'
                    }`
                  }
                >
                  마이페이지
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* 푸터 (선택사항) */}
          <div className="p-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              ESC 키를 눌러 닫을 수 있습니다
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
