import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import './App.css';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import { AuthProvider } from './context/AutoContext';
import ProtectedLayout from './layouts/ProtectedLayout';
import GoogleLoginPage from './pages/GooglePage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import SearchPage from './pages/SearchPage';


// 1. 홈 페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지


const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "v1/auth/google/callback", element: <GoogleLoginPage/>},
      

      // ✅ MyPage 를 ProtectedLayout 아래에 중첩시킴
      {
        element: <ProtectedLayout />,
        children: [
          { path: "user", element: <MyPage /> },
        ],
      },
    ],
  },
];
// protect랑 public을 나누지 않음 -> homelayout을 공통으로 outlet만 달라지게
const router = createBrowserRouter(routes);

export const queryClient = new QueryClient( { 
  defaultOptions: {
    queries: {
      retry: 3,
    }
  }
})

function App() {

  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
    <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  )
}

export default App
