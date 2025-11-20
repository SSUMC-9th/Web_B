import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useWithdraw from '../hooks/mutations/useWithdraw';
import { useState, useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sidebar 컴포넌트
 * - 데스크톱(lg 이상)에서는 항상 표시
 * - 모바일(lg 미만)에서는 isOpen 상태에 따라 표시/숨김
 * - 외부 클릭 시 onClose 콜백 실행
 * - ESC 키 입력 시 onClose 콜백 실행
 * - 탈퇴하기 버튼으로 회원탈퇴 모달 표시
 */
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { isAuthenticated } = useAuth();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdraw();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // ESC 키로 사이드바 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // keydown 이벤트 리스너 등록
    document.addEventListener('keydown', handleEscKey);

    // 클린업 함수: 컴포넌트 언마운트 또는 isOpen이 false일 때 리스너 제거
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // 배경 클릭 시 사이드바 닫기
  const handleBackdropClick = () => {
    onClose();
  };

  // 회원탈퇴 확인
  const handleWithdrawConfirm = () => {
    withdraw();
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

          {/* 탈퇴하기 버튼 (로그인 상태일 때만 표시) */}
          {isAuthenticated && (
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="w-full px-4 py-2 mt-4 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition text-sm border border-red-400/30"
            >
              탈퇴하기
            </button>
          )}

          {/* 푸터 정보 */}
          <div className="border-t border-gray-800 pt-4 text-xs text-gray-500">
            <p>© 2024 LP판</p>
            <p>All rights reserved</p>
          </div>
        </nav>
      </aside>

      {/* 회원탈퇴 확인 모달 */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm mx-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">회원 탈퇴</h3>
            <p className="text-gray-300 text-sm mb-4">
              정말 탈퇴하시겠습니까?
            </p>
            <p className="text-gray-400 text-xs mb-6">
              모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                disabled={isWithdrawing}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition"
              >
                아니오
              </button>
              <button
                onClick={handleWithdrawConfirm}
                disabled={isWithdrawing}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600 disabled:opacity-50 text-white rounded-lg transition"
              >
                {isWithdrawing ? '처리 중...' : '예'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
