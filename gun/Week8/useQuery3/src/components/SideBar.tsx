// src/components/Sidebar.tsx

import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AutoContext"; // 👈 useAuth 임포트

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}


const CustomSidebar = ({ isOpen, onClose }: SidebarProps) => {

    const { accessToken } = useAuth(); // 👈 accessToken 가져오기
    
    // 메뉴 링크에 적용할 공통 스타일
    const linkClassName = "text-lg font-medium text-gray-200 hover:text-white hover:bg-gray-700 rounded-lg p-3 transition-all duration-200";

  return (
    // 1. 오버레이 (Backdrop)
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm 
        transition-opacity duration-150 z-40 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      
      {/* 2. 실제 사이드바 메뉴 패널 */}
      <aside 
        className={`fixed left-0 top-0 bottom-0 w-64 bg-gray-800 text-gray-100 p-6 shadow-xl z-30
          transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        // 패널 내부 클릭 시 오버레이 닫기 방지 로직은 제거된 상태입니다.
      >
          
          {/* 1. 닫기 버튼 및 로고 영역 컨테이너 (이전과 동일) */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
             <div className="flex items-center gap-4"> 

                <button 
                  onClick={onClose} 
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                  aria-label="사이드바 닫기"
                >
                  <X size={24} /> 
              </button>

                {/* 2. 로고 */ }
                <Link to="/" onClick={onClose}>
                <span 
                    className="bg-clip-text text-transparent bg-linear-to-t from-gray-200 via-purple-400 to-violet-500 hover:from-gray-300 hover:via-purple-500 hover:to-violet-600 transition-all duration-300 text-4xl font-black tracking-tighter"
                >
                    SpinList
                </span>
                </Link>

             </div>
          </div>

          {/* 3. 메뉴 목록 */}
          <nav className="flex flex-col gap-2 mt-8">
                
                {/* 👈 로그인 되어 있지 않을 때 (비회원) */}
                {!accessToken && (
                    <>
                      <Link to="/login" className={linkClassName} onClick={onClose}>로그인</Link>
                      <Link to="/signup" className={linkClassName} onClick={onClose}>회원가입</Link>
                    </>
                )}

                {/* 👈 로그인 되어 있을 때 (회원) */}
                {accessToken && (
                    <Link to="/user" className={linkClassName} onClick={onClose}>마이페이지</Link>
                )}

                {/* 👈 검색페이지는 로그인 여부와 관계없이 항상 표시 */}
                <Link to="/search" className={linkClassName} onClick={onClose}>검색페이지</Link>

          </nav>
          
      </aside>
      
    </div>
  );
};

export default CustomSidebar;