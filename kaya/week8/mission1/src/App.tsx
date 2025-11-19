import './App.css'
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import HomeLayout from './layouts/HomeLayout.tsx';
import HomePage from './pages/HomePage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import MyPage from './pages/MyPage.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import ProtectedLayout from './layouts/ProtectedLayout.tsx';
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LpDetailPage from './pages/LpDetailPage.tsx';
import ThrottlePage from './pages/ThrottlePage.tsx';

// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지

// publicRoutes: 인증 없이 접근 가능한 라우트
const publicRoutes:RouteObject[] = [
  {
    path: '/',
    element: <HomeLayout/>,
    errorElement: <NotFoundPage/>,
    children: [
      { path: 'login', element: <LoginPage/> },
      { path: 'signup', element: <SignupPage/> },
      { path: 'v1/auth/google/callback', element: <GoogleLoginRedirectPage/>},
      { path: 'lps/:lpId', element: <LpDetailPage/>},
      { path: '/throttle', element: <ThrottlePage/>},
    ]
  }
];

// protectedRoutes: 인증이 필요한 라우트
const protectedRoutes:RouteObject[] = [
  {
    path:'/',
    element: <ProtectedLayout/>,
    errorElement: <NotFoundPage/>,
    children:[
      { index: true, element: <HomePage/> }, // 로그인 안하면 '/' 접근 불가
      { path: 'my', element: <MyPage/> },
    ]
  }
]

const router = createBrowserRouter([
  ...publicRoutes,
  ...protectedRoutes,
]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false}/>}
    </QueryClientProvider>
  )
}

export default App
