import type { Movie } from "../types/movie.ts";
import MovieCard from "./MovieCard.tsx";

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const MovieList = ({ movies, onMovieClick }: MovieListProps) => {
  return (
    <div className="px-4 md:px-8 lg:px-12 pb-20">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
        {movies.map((movie) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            onClick={() => onMovieClick(movie)}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieList;
