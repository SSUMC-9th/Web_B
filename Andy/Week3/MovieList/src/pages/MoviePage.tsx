import type { Movie, MovieResponse } from "../types/movie.ts";
import { useEffect, useState } from "react";
import axios from "axios";

const MoviePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  // 컴포넌트가 마운트될 때 한 번만 실행
  useEffect(() => {
    // 비동기로 영화 데이터를 가져오는 함수
    const fetchMovies = async () => {
      const { data } = await axios.get<MovieResponse>(
        'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
          },
        }
      );
      // API 응답의 results 배열을 movies state에 저장
      setMovies(data.results);
    };
    fetchMovies();
  }, []);

  // JSX 반환: 영화 목록을 ul 태그로 렌더링
  return (
    <ul>
      {movies?.map((movie) => (
        <li key={movie.id}>
          <h2>{movie.title}</h2>
        </li>
      ))}
    </ul>
  );
};

export default MoviePage;