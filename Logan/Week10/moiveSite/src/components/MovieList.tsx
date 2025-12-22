import React from "react";
import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

// MovieList 컴포넌트는 props로 movies를 받는데, 그건 Movie 배열이다”
interface MovieListProps {
  movies: Movie[];
}

// 구조분해할당형식
// 무비리스트컴포넌트는 Movie배열형태의 movies props가 있는거임
const MovieList = ({ movies }: MovieListProps) => {
  if (movies.length === 0) {
    return (
      <div className="flex h-60 items-center justify-center">
        <p className="font-bold text-gray-500">검색결과가 아리마센</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieList;
