import axios from "axios";
import type { MovieResponse } from "../types/movie.ts";

export const getMovieInfo = async (id: number) => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const response = await axios.get<MovieResponse>(
    `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        accept: 'application/json',
      }
    }
  );
  return response.data;
}