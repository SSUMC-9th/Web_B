import {createBrowserRouter, type RouteObject, RouterProvider} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import MyPage from "./pages/MyPage.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import HomeLayout from "./layouts/HomeLayout.tsx";
import ProtectedLayout from "./layouts/ProtectedLayout.tsx";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage.tsx";

const publicRouter: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
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
        path: "mypage",
        element: <MyPage />,
      }
    ],
  }
];


const router = createBrowserRouter([...publicRouter, ...protectedRouter]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;