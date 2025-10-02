import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { MovieDetails, Credits } from "../types/movie";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [detail, setDetail] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    const headers = { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` };

    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);
      try {
        const [dRes, cRes] = await Promise.all([
          axios.get<MovieDetails>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            { headers }
          ),
          axios.get<Credits>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            { headers }
          ),
        ]);
        setDetail(dRes.data);
        setCredits(cRes.data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [movieId]);

  if (isError) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <span className="text-red-500 text-2xl">영화 정보를 불러오지 못했습니다.</span>
      </div>
    );
  }

  if (isPending || !detail) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="text-white p-6">
      {/* 상단 기본 정보 */}
      <h1 className="text-3xl font-bold">{detail.title}</h1>
      <p className="text-sm text-gray-300 mt-1">
        평균 {detail.vote_average.toFixed(1)} · {detail.release_date.slice(0, 4)}
        {detail.runtime ? ` · ${detail.runtime}분` : ""}
      </p>
      {detail.tagline && <p className="mt-2 italic text-gray-400">{detail.tagline}</p>}
      <p className="mt-4 leading-7">{detail.overview || "소개가 없습니다."}</p>

      {/* 감독/출연 */}
      <h2 className="mt-8 text-xl font-semibold">감독/출연</h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-4">
        {/* 감독 */}
        {credits?.crew
          .filter((c) => c.job === "Director")
          .map((d) => (
            <div key={d.id} className="text-center">
              <img
                src={
                  d.profile_path
                    ? `https://image.tmdb.org/t/p/w185${d.profile_path}`
                    : "https://via.placeholder.com/185?text=No+Image"
                }
                alt={d.name}
                className="rounded-full mx-auto"
              />
              <p className="mt-2">{d.name}</p>
              <p className="text-sm text-gray-400">{d.job}</p>
            </div>
          ))}

        {/* 출연 상위 6명 */}
        {credits?.cast.slice(0, 6).map((a) => (
          <div key={a.id} className="text-center">
            <img
              src={
                a.profile_path
                  ? `https://image.tmdb.org/t/p/w185${a.profile_path}`
                  : "https://via.placeholder.com/185?text=No+Image"
              }
              alt={a.name}
              className="rounded-full mx-auto"
            />
            <p className="mt-2">{a.name}</p>
            <p className="text-sm text-gray-400">{a.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
