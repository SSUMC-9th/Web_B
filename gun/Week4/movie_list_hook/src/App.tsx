import './App.css'
import HomePage from './pages/HomePage';
import MoivePage from './pages/MoviePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/NotFound';
import MovieDetailPage from './pages/MovieDetailPage';

// BrowserRouter v5
// createBrowserRouter v6
// react-route-dom v7(next.js, remix)

const router = createBrowserRouter([
  {
    path:'/',
    element: <HomePage/>,
    errorElement: <NotFoundPage/>,

    // children = path의 상세 목록들
    children: [   
      {
      path: 'movies/:category',
      element: <MoivePage/>,
      },
      {
        path: 'movie/:movieId',
        element: <MovieDetailPage/>
      }

    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
