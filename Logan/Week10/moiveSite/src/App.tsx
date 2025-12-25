import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import MovieDetailPage from "./pages/MovieDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  { path: "/:id", element: <MovieDetailPage /> }, // : 을 입력하면 변수로 인식
]);
function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      {/* <HomePage /> */}
    </div>
  );
}

export default App;
