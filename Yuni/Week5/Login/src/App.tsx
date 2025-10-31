import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ErrorPage from './pages/NotFoundPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

/**
 * Protected Route 라우터 설정 예제
 *
 * ProtectedRoute를 감싸면 로그인이 필요한 페이지가 됩니다:
 * - 토큰이 없으면 자동으로 /login으로 리다이렉트
 * - 토큰이 있으면 페이지 접근 가능
 *
 * requiredRole을 지정하면 RBAC (Role-Based Access Control) 적용:
 * - <ProtectedRoute requiredRole="admin">
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
      // Protected Route 예제: 로그인 필요
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      // Protected Route 예제: admin만 접근 가능 (RBAC)
      // {
      //   path: "admin",
      //   element: (
      //     <ProtectedRoute requiredRole="admin">
      //       <AdminPage />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
