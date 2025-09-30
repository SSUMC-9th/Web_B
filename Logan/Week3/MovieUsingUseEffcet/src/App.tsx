
import './App.css'
import MoviePage from './pages/MoviePage';

function App() {
  console.log(import.meta.env.VITE_TMDB)


  return (
    <>
      <MoviePage/>
    </>
  )
}

export default App;
