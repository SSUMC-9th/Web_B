import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import type { MovieResponse, Movie } from "../types/movie";



// const MoviesPage=() =>{

//     //const [movies, setMovies]=useState<Movie[]>([])

//     //동적경로에서 넘겨받은 값 읽기 ~ useParams()

//     const params=useParams(); //{ movieId?: string }
//     console.log(params);
//     return <h1> {params.movieId}번의 Movies Page 야호~!</h1>

//     return <h1>영화 데이터 불러오기</h1>
// }

// export default MoviesPage;


// export default movies;


import React from 'react';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);



  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await axios.get<MovieResponse>(
        'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYzFkN2JiMmJmZDQ1ZGNjYzIzMmViMmYzMmQxMmE5OSIsIm5iZiI6MTc1OTEzMjExMi42ODUsInN1YiI6IjY4ZGEzOWQwNDJmNDI2YTU5YWJiMGRmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uo_n_stiLgG9UAE7HFIoeLbxbQepLAR5fW-GpH2QEEE`, // 본인 TMDB 토큰으로 교체
          },
        }
      );
      setMovies(data.results);
    };

    fetchMovies();
  }, []);
  
  console.log(movies);
  return (
    <ul>
      {movies?.map((movie) => (
        <li key={movie.id}>
          <h2>{movie.title}</h2>
          <p>{movie.release_date}</p>
        </li>
      ))}
    </ul>
  );
};

export default MoviesPage;