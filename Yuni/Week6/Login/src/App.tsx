import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ErrorPage from './pages/NotFoundPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import DetailPage from './pages/DetailPage.tsx';
import GoogleCallbackPage from './pages/GoogleCallbackPage.tsx';
import HomeLayout from './layouts/HomeLayout.tsx';
import ProtectedLayout from './layouts/ProtectedLayout.tsx';
import { AuthProvider } from './contexts/AuthContext';

/**
 * 레이아웃 기반 라우터 설정
 *
 * - HomeLayout: 공개 페이지 (로그인, 회원가입 등)
 * - ProtectedLayout: 보호된 페이지 (대시보드 등)
 */
export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
      { path: "lp/:lpId", element: <DetailPage /> },
      { path: "v1/auth/google/callback", element: <GoogleCallbackPage /> },  // Google OAuth 콜백
    ],
  },
  {
    path: '/protected',
    element: <ProtectedLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      // { path: "admin", element: <AdminPage /> },  // admin 페이지 예제
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} /> }
    </QueryClientProvider>
  )
}

export default App
