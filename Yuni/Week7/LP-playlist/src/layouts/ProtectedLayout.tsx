import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedLayout - 로그인이 필요한 페이지용 레이아웃
 * 인증된 사용자만 접근 가능하며, 로그인하지 않으면 /login으로 리다이렉트됩니다.
 * Navbar와 Footer를 포함하여 모든 보호된 페이지에서 일관된 UI를 제공합니다.
 */
export default function ProtectedLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-950 text-white">
        <Navbar onToggleSidebar={handleToggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            <p className="mt-4 text-gray-400">로딩 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 인증되지 않으면 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Navbar onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
