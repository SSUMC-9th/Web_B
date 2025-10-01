import axios from "axios";
import type { MoviesResponse } from "../types/movie.ts";

export const fetchMovies = async (category: string, page: number): Promise<MoviesResponse> => {
  const response = await axios.get<MoviesResponse>(
    `https://api.themoviedb.org/3/movie/${category}?include_adult=false&include_video=false&language=ko-KR&page=${page}&sort_by=popularity.desc`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        accept: 'application/json',
      }
    }
  );
  return response.data;
};
