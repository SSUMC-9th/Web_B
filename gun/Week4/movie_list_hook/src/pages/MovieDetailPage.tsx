import { useLocation, useParams } from "react-router-dom";
import type { Movie, MovieCreditsResponse} from "../types/movie";
import Credit from "../components/Credit";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useFetch } from "../hooks/useCustomFetch";

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const location = useLocation(); //state로 넘긴 값 useLocation으로 받음
  const movie = location.state as Movie | undefined; 


  const { data, isPending, isError } = useFetch<MovieCreditsResponse>(
  `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`
  );

  if (isPending) {
      return (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      );
    }


  if (isError) {
      return <div>
        <span className='font-bold text-red-500 text-2xl'>에러입니다. 삐용삐용 올바른 movie/id인지 확인하세요.</span>
      </div>
    }

    // ✅ 훅 데이터에서 바로 cast 추출
  const cast = data?.cast ?? [];

  // (옵션) location.state가 없을 수도 있을 때 가드
  if (!movie) {
    return <div className="p-6 text-white">영화 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="bg-black text-white p-8">
      <div
        className="relative bg-cover bg-center text-white p-8 rounded-xl shadow-lg min-h-80"
        style={{
          // ✅ https 권장
          backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold">{movie.title}</h2>
          <p className="p-2">{movie.release_date}</p>
          <p className="p-2">평균: {movie.vote_average}</p>
          <p className="p-2">{movie.original_title}</p>
          <p className="p-2 break-words w-200">{movie.overview}</p>
        </div>
      </div>

      <div className="w-200 border-b-1 border-white my-6" />

      <div className="bg-black text-white">
        <h2 className="text-3xl font-bold">감독/출연</h2>
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
          {cast.map((c) => (
            <Credit key={c.credit_id} movie_c={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
