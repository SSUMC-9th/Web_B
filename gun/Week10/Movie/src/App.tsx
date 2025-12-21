import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HomePage from "./Pages/HomePage"
import MovieDetailPage from "./Pages/MovieDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: '/movie/:id',
    element: <MovieDetailPage/>,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
