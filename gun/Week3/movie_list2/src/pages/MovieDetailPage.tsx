import { useLocation, useParams } from "react-router-dom";
import type { Movie, MovieCast, MovieCreditsResponse} from "../types/movie";
import { useEffect, useState } from "react";
import axios from "axios";
import Credit from "../components/Credit";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const location = useLocation(); //state로 넘긴 값 useLocation으로 받음
  const movie = location.state as Movie | undefined; 

  const [movieC, setmovieC] = useState<MovieCast[]>([]);
  //1. 로딩상태
  const [isPending, setIsPending] = useState(false);
  //2. 에러상태
  const [isError, setIsError] = useState(false);

  useEffect((): void => {

    const fetchMovies = async (): Promise<void> => {;
      setIsPending(true);

      try{
      const {data} = await axios.get<MovieCreditsResponse>(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        }
      );
      setmovieC(data.cast);
      setIsPending(false);  
    } catch{
      setIsError(true);
    } finally{
      setIsPending(false);
    }

    };

    fetchMovies();
  }, [movieId]);

  if (isError) {
    return <div>
      <span className='font-bold text-red-500 text-2xl'>에러입니다. 삐용삐용 올바른 movie/id인지 확인하세요.</span>
    </div>
  }

  return (
    <>
      {isPending && (
        <div className='flex items-center justify-center h-dvh'>
          <LoadingSpinner/>
        </div>
      )}

      {!isPending && movie && (
        <div className='bg-black text-white p-8'>
            <div
              className="relative 
                        bg-cover bg-center text-white 
                        p-8 rounded-xl shadow-lg min-h-80"
              style={{
                backgroundImage: `url(http://image.tmdb.org/t/p/w500${movie.poster_path})`,
              }}>
              <div className="absolute inset-0 bg-black/60" /> {/* 어둡게 오버레이 */}
              <div className="relative z-10">
                <h2 className="text-3xl font-bold">{movie.title}</h2>
                <p className = 'p-2'>{movie.release_date}</p>
                <p className = 'p-2'>평균: {movie.vote_average}</p>
                <p className = 'p-2'>{movie.original_title}</p>
                <p className =' p-2 break-words w-200'>{movie.overview}</p>
              </div>
              </div>
            <div className="w-200 border-b-1 border-white"></div>
            <div className='bg-black text-white p-8'>
              <h2 className="text-3xl font-bold">감독/출연</h2>
                <div>    
                    <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10'>
                      {movieC && movieC.map((movie_c) => (
                          <Credit key={movie_c.credit_id} movie_c = {movie_c} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
    </>
  );
}
