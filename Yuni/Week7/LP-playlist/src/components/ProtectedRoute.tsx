import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user'; // RBAC - 특정 역할 요구
}

/**
 * Protected Route Component
 *
 * 로그인한 사용자만 접근할 수 있는 페이지를 보호합니다.
 * - 토큰이 없으면 로그인 페이지로 리다이렉트
 * - requiredRole이 지정되면, 해당 역할을 가진 사용자만 접근 가능 (RBAC)
 *
 * @example
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 *
 * @example
 * <ProtectedRoute requiredRole="admin">
 *   <AdminPanel />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  // 로그인하지 않은 경우 - 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // RBAC 검사 - 특정 역할이 필요한 경우
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">접근 권한 없음</h1>
          <p className="text-gray-400">이 페이지에 접근할 권한이 없습니다.</p>
        </div>
      </div>
    );
  }

  // 모든 조건을 만족한 경우 - 페이지 렌더링
  return <>{children}</>;
}
