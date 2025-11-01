import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import NotFound from "./pages/not-found";

const ROUTER = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>,
    errorElement: (
      <h1 className="min-h-screen grid place-items-center text-2xl font-bold text-red-700">
        빙시나 여기는 에러야 올바른 곳으로 오렴
      </h1>
    )
  },

  {
    path:'/승환', 
    element: 
      <div className="min-h-screen flex flex-col items-center justify-center gap-10 bg-gradient-to-br from-blue-50 to-indigo-500 px-4">
        <h1 className="text-5xl font-bold flex items-center justify-center bg-blue-500 text-white max-w-3xl w-full p-8 rounded-2xl shadow-lg transition active:scale-95">
          이것은 승페이지요
        </h1>
        <a
          href="/"
          className="mt-6 inline-flex items-center rounded-xl bg-slate-900 text-white px-4 py-2 shadow transition hover:bg-slate-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          홈으로
        </a>
      </div>
  },

  {
    path:'/장준영',
    element: 
      <div className="min-h-screen flex flex-col items-center justify-center gap-10 bg-gradient-to-br from-emerald-50 to-teal-500 px-4">
        <h1 className="text-5xl font-bold flex items-center justify-center bg-emerald-500 text-white max-w-3xl w-full p-8 rounded-2xl shadow-lg transition active:scale-95">
          이것은 장페이지요
        </h1>
        <a
          href="/"
          className="mt-6 inline-flex items-center rounded-xl bg-slate-900 text-white px-4 py-2 shadow transition hover:bg-slate-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          홈으로
        </a>
      </div>
  },


  { path: '*', element: <NotFound /> },
  

]);

function App() {
  return <RouterProvider router={ROUTER}/>;
}

export default App;
