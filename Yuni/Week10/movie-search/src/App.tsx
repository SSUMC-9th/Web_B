import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MoviePage from "./pages/MoviePage";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import MovieDetailPage from "./pages/MovieDetailPage.tsx";

const router = createBrowserRouter([
    { path: "/",
      element: <HomePage />,
      errorElement: <NotFoundPage />,
      children: [
        { index: true,
          element: <MoviePage />,
        },
        { path: "movies/:category",
          element: <MoviePage />,
        },
        { path: "movies/detail/:movieId",
          element: <MovieDetailPage />,
        }
      ]
    }
]);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;