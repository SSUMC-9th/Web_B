import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import type { Movie } from "../types/movie";

// 상세 페이지 전용 타입 확장
interface MovieDetail extends Movie {
  tagline: string;
  runtime: number;
  genres: { id: number; name: string }[];
}

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 영화 상세 정보 가져오기
  const { data: movie, isLoading, error } = useFetch<MovieDetail>(`/movie/${id}`, {
    params: { language: "ko-KR" },
  });

  const imageBaseUrl = "https://image.tmdb.org/t/p/original";
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-[#0f0f0f]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
    </div>
  );

  if (error || !movie) return (
    <div className="flex h-screen items-center justify-center bg-[#0f0f0f] text-white">
      <p>영화 정보를 불러올 수 없습니다. ⚠️</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* 배경 히어로 섹션 */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={`${imageBaseUrl}${movie.backdrop_path}`}
          className="h-full w-full object-cover opacity-40"
          alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
        
        {/* 뒤로가기 버튼 */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-8 top-8 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 backdrop-blur-md transition-hover hover:bg-white hover:text-black"
        >
          ← 뒤로가기
        </button>
      </div>

      {/* 컨텐츠 섹션 */}
      <div className="container mx-auto -mt-40 px-6 pb-20">
        <div className="flex flex-col gap-10 md:flex-row">
          {/* 포스터 */}
          <div className="z-10 w-full shrink-0 md:w-80">
            <img
              src={`${posterBaseUrl}${movie.poster_path}`}
              alt={movie.title}
              className="rounded-2xl shadow-2xl shadow-cyan-500/10"
            />
          </div>

          {/* 상세 정보 */}
          <div className="flex flex-col justify-end pt-10 md:pt-40">
            <h1 className="text-4xl font-black md:text-6xl">{movie.title}</h1>
            <p className="mt-2 text-xl italic text-gray-400">{movie.tagline}</p>
            
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-bold">
              <span className="flex items-center gap-1 text-yellow-400">★ {movie.vote_average.toFixed(1)}</span>
              <span className="text-gray-500">|</span>
              <span>{movie.release_date}</span>
              <span className="text-gray-500">|</span>
              <span>{movie.runtime}분</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-sm">
                  {genre.name}
                </span>
              ))}
            </div>

            <h3 className="mt-10 text-2xl font-bold">줄거리</h3>
            <p className="mt-4 max-w-2xl leading-relaxed text-gray-300">
              {movie.overview || "등록된 줄거리가 없습니다."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;