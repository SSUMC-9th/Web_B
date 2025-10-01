import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import NotFoundPage from "./pages/NotFoundPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/movies/:category',
        element: <MoviePage />,
        errorElement: <NotFoundPage />,
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
