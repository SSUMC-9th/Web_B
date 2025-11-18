// HomeLayout.jsx (전체 다크 모드 스타일 적용)

import { Link, Outlet } from "react-router-dom";
import NavBar from "../components/Navbar";
import useSidebar from "../hooks/useSideBar";
import HamburgerButton from "../components/hamburgerbar";
import CustomSidebar from "../components/SideBar";


const HomeLayout = () => {

  const { isSidebarOpen, toggleSidebar } = useSidebar(false);

  return (
    // 1. 가장 바깥쪽 div: 배경색을 어둡게 설정
    <div className="min-h-dvh w-full bg-gray-900 text-gray-100"> 
      
      {/* 2. 두 번째 div: w-full과 flex-col만 유지 */}
      <div className="min-h-dvh flex flex-col overflow-hidden w-full"> 
        
        {/* 1. 헤더(네브바 영역) */}
        <header className="sticky top-0 z-20 bg-gray-900/90 backdrop-blur border-b border-gray-700 w-full"> 
          <div className="px-6 py-4 flex items-center justify-between w-full"> 
            
            {/* 왼쪽 그룹: 햄버거 버튼과 로고를 함께 묶어 왼쪽 정렬 */}
            <div className="flex items-center gap-4">
                {/* 햄버거 버튼 아이콘 색상 조정을 위해 tailwind.config.js에서 수정 필요할 수 있음 */}
                <HamburgerButton
                    onClick={toggleSidebar}
                    isOpen={isSidebarOpen}
                />
                
                <div className="text-2xl font-semibold tracking-tight">
                <Link to="/"> 
                    <div className="text-4xl font-black tracking-tighter cursor-pointer">
                      <span 
                          className="bg-clip-text text-transparent 
                                    bg-linear-to-t  
                                    from-gray-200 via-purple-400 to-fuchsia-500 // 👈 그라데이션 색상 조정 (밝게)
                                    hover:from-gray-300 hover:via-purple-500 hover:to-fuchsia-600
                                    transition-all duration-300"
                      >
                          SpinList
                      </span>
                  </div>
                </Link> 
              </div>
            </div>
            
            <NavBar /> {/* NavBar 텍스트 색상도 내부적으로 조정 필요 */}
          
          </div>
        </header>

        {/* 메인 콘텐츠 상단 경계선 */}
        <div className="border-t border-gray-700 w-full"></div>

        {/* 메인 */}
        <main className="flex-1 w-full">
          <div className="px-6 py-8 w-full">
            <Outlet /> {/* Outlet 내부 콘텐츠의 배경과 텍스트 색상도 별도로 조정 필요 */}
          </div>
        </main>

        {/* 메인 콘텐츠 하단 경계선 (화면 전체 너비) */}
        <div className="border-b border-gray-700 w-full"></div>

        {/* 푸터 */}
        <footer className="bg-gray-800 text-gray-400 border-t border-gray-700 w-full">
          <div className="px-6 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            <p className="text-sm">
              © {new Date().getFullYear()} GUN company. All rights reserved.
            </p>
          </div>
        </footer>

        <CustomSidebar
            isOpen={isSidebarOpen} 
            onClose={toggleSidebar} 
        />

      </div>
    </div>
  );
};

export default HomeLayout;