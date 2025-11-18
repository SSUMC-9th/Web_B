import { Link, Outlet } from "react-router-dom";
import NavBar from "../components/Navbar";
import useSidebar from "../hooks/useSideBar";
import HamburgerButton from "../components/hamburgerbar";
import CustomSidebar from "../components/SideBar";
import React, { useState } from 'react';
import { Plus } from 'lucide-react'; 

// 💡 새로 생성된 모달 컴포넌트를 임포트합니다.
import Modal from '../components/Modal'; 
import LpPostForm from "../components/LpPostForm";


const HomeLayout = () => {
    // NOTE: 외부 훅 사용을 가정합니다.
    const { isSidebarOpen, toggleSidebar } = useSidebar(false);

    // ⭐ 1. 모달 열림/닫힘 상태만 관리합니다. ⭐
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 모달 열기 
    const handleOpenPostModal = () => {
        setIsModalOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // ----------------------------------------------------------------------
    // 💡 PostForm 로직과 JSX는 LpPostForm 컴포넌트로 분리되었습니다. 
    // ----------------------------------------------------------------------


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
                        
                        {/* 오른쪽 그룹: NavBar만 남김 */}
                        <div className="flex items-center space-x-4">
                            <NavBar /> 
                        </div>
                    
                    </div>
                </header>

                {/* 메인 콘텐츠 상단 경계선 */}
                <div className="border-t border-gray-700 w-full"></div>

                {/* 메인 */}
                <main className="flex-1 w-full">
                    <div className="px-6 py-8 w-full">
                        <Outlet /> 
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

            {/* ⭐ 4. 모달 컴포넌트 렌더링 (LpPostForm 전달) ⭐ */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                <LpPostForm
                    onClose={closeModal} // LpPostForm 내부에서 닫을 수 있도록 함수 전달
                />
            </Modal>

            {/* ⭐ 5. 왼쪽 아래에 고정된 모달 트리거 버튼 ⭐ */}
            <button 
                onClick={handleOpenPostModal} 
                className="fixed bottom-15 right-5 left-auto z-30 p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105"
                aria-label="새 LP 작성"
                title="새 LP 작성"
            >
                <Plus className="w-6 h-6" />
            </button>

        </div>
    );
};

export default HomeLayout;