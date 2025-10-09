// src/pages/MovieDetailPage.tsx
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { MovieDetails, Credits } from "../types/movie";
import { useCustomFetch } from "../hooks/useCustomFetch";

const IMG = {
  backdrop: (p?: string | null) =>
    p ? `https://image.tmdb.org/t/p/w1280${p}` : "https://via.placeholder.com/1280x720?text=No+Image",
  profile: (p?: string | null) =>
    p ? `https://image.tmdb.org/t/p/w185${p}` : "https://via.placeholder.com/185?text=No+Image",
};

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  const {
    data: detail,
    isPending: isDetailLoading,
    isError: isDetailError,
    errorMessage: detailErrMsg,
    refetch: refetchDetail,
  } = useCustomFetch<MovieDetails>(
    movieId ? `/movie/${movieId}` : null,
    { params: { language: "ko-KR" } },
    [movieId]
  );

  const {
    data: credits,
    isPending: isCreditsLoading,
    isError: isCreditsError,
    errorMessage: creditsErrMsg,
    refetch: refetchCredits,
  } = useCustomFetch<Credits>(
    movieId ? `/movie/${movieId}/credits` : null,
    { params: { language: "ko-KR" } },
    [movieId]
  );

  if (isDetailError) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-black text-white gap-3">
        <span className="text-red-500 text-2xl">영화 정보를 불러오지 못했습니다.</span>
        <span className="text-sm text-gray-400">{detailErrMsg}</span>
        <button className="px-4 py-2 rounded bg-white/10 hover:bg-white/20" onClick={refetchDetail}>
          다시 시도
        </button>
      </div>
    );
  }

  if (isDetailLoading || !detail) {
    return (
      <div className="flex items-center justify-center h-dvh bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  const year = detail.release_date?.slice(0, 4) ?? "";
  const rating = Number.isFinite(detail.vote_average) ? detail.vote_average.toFixed(1) : "-";
  const runtime = detail.runtime ? `${detail.runtime}분` : "";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 히어로 */}
      <section className="relative h-[260px] sm:h-[340px] md:h-[420px] rounded-2xl overflow-hidden mx-3 sm:mx-6 mt-4">
        <img src={IMG.backdrop(detail.backdrop_path)} alt={detail.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/85" />
        <div className="absolute inset-0 flex items-end">
          <div className="p-4 sm:p-6 md:p-8 max-w-5xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold drop-shadow">{detail.title}</h1>
            <div className="mt-2 text-sm sm:text-base text-gray-200/90 space-y-0.5">
              <div className="font-semibold">평균 {rating}</div>
              <div>{year}</div>
              {runtime && <div>{runtime}</div>}
            </div>
            {detail.tagline && <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg italic text-gray-100">{detail.tagline}</p>}
          </div>
        </div>
      </section>

      <div className="mx-3 sm:mx-6 my-6 border-t border-white/10" />

      {/* 줄거리 전체 */}
      <section className="px-4 sm:px-6 md:px-8 max-w-5xl">
        <p className="leading-7 text-gray-200 whitespace-pre-wrap">{detail.overview || "소개가 없습니다."}</p>
      </section>

      <div className="mx-3 sm:mx-6 my-8 border-t border-white/10" />

      {/* 감독/출연 */}
      <section className="px-4 sm:px-6 md:px-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-3xl font-bold tracking-tight">감독/출연</h2>
          {isCreditsError && (
            <button className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-sm" onClick={refetchCredits}>
              크레딧 다시 시도
            </button>
          )}
        </div>

        {isCreditsLoading && (
          <div className="flex items-center justify-center h-40">
            <LoadingSpinner />
          </div>
        )}

        {!isCreditsLoading && !isCreditsError && (
          <div className="mt-6 grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}>
            {credits?.crew.filter((c) => c.job === "Director").map((d) => (
              <PersonCard key={`director-${d.id}`} img={IMG.profile(d.profile_path)} name={d.name} sub={d.job} />
            ))}

            {credits?.cast.slice(0, 24).map((a) => (
              <PersonCard key={`cast-${a.id}`} img={IMG.profile(a.profile_path)} name={a.name} sub={a.character} />
            ))}
          </div>
        )}

        {isCreditsError && (
          <p className="mt-4 text-sm text-red-400">
            출연 정보를 불러오지 못했습니다. {creditsErrMsg}
          </p>
        )}
      </section>

      <div className="h-12" />
    </div>
  );
}

function PersonCard({ img, name, sub }: { img: string; name: string; sub?: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto size-28 md:size-32 rounded-full overflow-hidden ring-1 ring-white/15 shadow">
        <img src={img} alt={name} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <p className="mt-2 text-sm sm:text-base font-medium truncate">{name}</p>
      {sub && <p className="text-xs sm:text-sm text-gray-400 truncate">{sub}</p>}
    </div>
  );
}
