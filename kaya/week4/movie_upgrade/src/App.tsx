import './App.css'
import MoviePage from './pages/MoviePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import MovieDetailPage_1 from './pages/MovieDetailPage_1.tsx';

// BrowserRouter v5
// createBrowserRouter v6

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>,
    errorElement: <NotFoundPage/>,
    children: [
      {
        path: 'movies/:category',
        element: <MoviePage/>,
      },
      {
        path: 'movie/:movieId',
        element: <MovieDetailPage_1/>
      }
    ],
  }
])

// movie/upcoming
// movie/popular
// movie/now_playing
// movie/top_rated
// movie/category/{movie_id}

function App() {
  //console.log(import.meta.env.VITE_TMDB_KEY);
  return <RouterProvider router={router}/>
}

export default App;
