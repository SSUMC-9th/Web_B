import { useEffect } from "react";
import type { Movie } from "../types/movie";

interface MovieDetailModalProps {
  isOpen: boolean;
  movie: Movie | null;
  onClose: () => void;
}

const TMDB_IMG = "https://image.tmdb.org/t/p/original";

export default function MovieDetailModal({
  isOpen,
  movie,
  onClose,
}: MovieDetailModalProps) {
  // ESC로 닫기 + 스크롤 잠금
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMG}${movie.backdrop_path}`
    : "";
  const posterUrl = movie.poster_path ? `${TMDB_IMG}${movie.poster_path}` : "";

  const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(
    movie.title
  )}`;

  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : "-";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="영화 상세 정보 모달"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal box */}
      <div className="relative z-10 w-[92vw] max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Top poster/backdrop */}
        <div className="relative h-[360px] w-full bg-black">
          {backdropUrl ? (
            <img
              src={backdropUrl}
              alt={`${movie.title} 배경`}
              className="h-full w-full object-cover opacity-90"
            />
          ) : posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="h-full w-full object-cover opacity-90"
            />
          ) : (
            <div className="h-full w-full" />
          )}

          {/* Dark gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          {/* Close (X) */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-black/45 text-white hover:bg-black/60"
            aria-label="모달 닫기"
            type="button"
          >
            ✕
          </button>

          {/* Title area */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <h2 className="text-2xl font-bold">{movie.title}</h2>
            {movie.original_title && movie.original_title !== movie.title && (
              <p className="mt-1 text-sm text-white/80">
                {movie.original_title}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[260px_1fr]">
          {/* Poster */}
          <div className="flex justify-center md:justify-start">
            <div className="w-[220px] overflow-hidden rounded-xl shadow-lg">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={`${movie.title} 포스터`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid aspect-[2/3] w-full place-items-center bg-gray-100 text-gray-500">
                  포스터 없음
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  {rating}
                </span>
                <span className="text-sm text-gray-500">
                  ({movie.vote_count ?? 0} 평가)
                </span>
              </div>

              <div className="text-sm text-gray-700">
                <span className="font-semibold">개봉일</span>{" "}
                <span className="text-gray-600">
                  {movie.release_date || "정보 없음"}
                </span>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                줄거리
              </h3>
              <p className="leading-relaxed text-gray-700">
                {movie.overview?.trim()
                  ? movie.overview
                  : "줄거리 정보가 없습니다."}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={imdbUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                IMDb에서 검색
              </a>

              <button
                onClick={onClose}
                className="rounded-lg border border-blue-300 px-5 py-2 text-blue-700 hover:bg-blue-50"
                type="button"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
