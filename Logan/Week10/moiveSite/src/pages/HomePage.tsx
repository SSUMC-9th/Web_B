import React from "react";
import useFetch from "../hooks/useFetch";
import type { MovieResponse } from "../types/movie";
import MovieList from "../components/MovieList";
import MovieFilter from "../components/MovieFilter";

export default function HomePage() {
  const { data, error, isLoading } = useFetch<MovieResponse>("/search/movie", {
    params: {
      query: "어벤져스",
      include_adult: false,
      language: "ko-KR",
    },
  });

  if (error) {
    return <div>{error}</div>;
  }
  console.log(data);

  return (
    <div className="container">
      <MovieFilter />
      {isLoading ? (
        <div>로딩중입니다...</div>
      ) : (
        <MovieList movies={data?.results || []} />
      )}
    </div>
  );
}
