import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import MovieDetailsPage from "./pages/MovieDetailsPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/movies/:category',
        element: <MoviesPage />,
        errorElement: <NotFoundPage />,
      },
      {
        path: '/movie/:id',
        element: <MovieDetailsPage />,
        errorElement: <NotFoundPage />,
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
