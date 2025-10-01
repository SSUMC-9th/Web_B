import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/home'
import NotFound from './pages/not-found'
import MoviesPage from './pages/movies'
import Movies from './pages/movies' 
import RootLayout from './layout/root-layout'
import UseEffectPage from './02-useEffect/UseEffectPage'
import useEffectCounterPage from "./02-useEffect/UseEffectCounterPage"



const router= createBrowserRouter([
  {
    path: '/',
    element: <RootLayout/>,
    errorElement: <NotFound/>,
    children:[
      {
        index: true,
        element: <HomePage/>,
      },
      {
        // 동적라우팅: movieId에 해당하는 페이지로 연결
        path: 'movies/:movieId',
        element: <MoviesPage/>,
      }
    ]
  },

]);


function App() {

  return (
    //<RouterProvider router={router}/>
    //<UseEffectPage/>
    <useEffectCounterPage/>
    
  )
  
}

export default App


















// const Page1= ()=> <h1>페이지1번</h1>
// const Page2= ()=> <h1>페이지2번</h1>
// const Page3= ()=> <h1>페이지3번</h1>
// const Page4= ()=> <h1>페이지4번</h1>


// function App(){
  
//   const name='원호';

//   const {pathname}=window.location;

//   switch(pathname){
//     case '/page1':
//       return <Page1 />;
//     case '/page2':
//       return <Page2 />;
//     case '/page3':
//       return <Page3 />;
//     case '/page4':
//       return <Page4 />;
//   }

// }

// export default App