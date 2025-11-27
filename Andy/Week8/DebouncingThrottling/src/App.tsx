import { createBrowserRouter, type RouteObject, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import MyPage from "./pages/MyPage.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import HomeLayout from "./layouts/HomeLayout.tsx";
import ProtectedLayout from "./layouts/ProtectedLayout.tsx";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage.tsx";
import { LpDetailPage } from "./pages/LpDetailPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ThrottlePage from "./pages/ThrottlePage.tsx";

const publicRouter: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "v1/auth/google/callback",
        element: <GoogleLoginRedirectPage />,
      },
      {
        path: "lps/:lpid",
        element: <LpDetailPage />
      },
      {
        path: "/throttle",
        element: <ThrottlePage />
      }
    ],
  },
];

const protectedRouter: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "explore",
        element: <HomePage />,
      },
      {
        path: "mypage",
        element: <MyPage />,
      }
    ],
  }
];

const router = createBrowserRouter([...publicRouter, ...protectedRouter]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>

      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;