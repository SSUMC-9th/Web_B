
import type { MovieDetail } from "../types/MovieDetail";

const IMG = (p?: string | null, size: "w500" | "original" = "w500") =>
  p ? `https://image.tmdb.org/t/p/${size}${p}` : "/placeholder_poster.svg";

export default function MovieDetailHero({ detail }: { detail: MovieDetail }) {
  return (
    <section className="relative overflow-hidden rounded-3xl">
      {/* 배경 */}
      <div className="absolute inset-0">
        <img
          src={IMG(detail.backdrop_path ?? detail.poster_path, "original")}
          alt={detail.title}
          className="h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/0" />
      </div>

      {/* 내용 */}
      <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row gap-6 md:gap-10">
        <img
          src={IMG(detail.poster_path)}
          alt={detail.title}
          className="w-40 sm:w-48 md:w-52 rounded-2xl shadow-2xl ring-1 ring-white/20"
        />

        <div className="flex-1 text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow">
            {detail.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold
                             bg-white/15 backdrop-blur ring-1 ring-white/20"
            >
              개봉 {detail.release_date || "-"}
            </span>
            {detail.runtime ? (
              <span
                className="px-2.5 py-1 rounded-full text-xs font-semibold
                               bg-white/15 backdrop-blur ring-1 ring-white/20"
              >
                ⏱ {detail.runtime}분
              </span>
            ) : null}
            {detail.vote_average ? (
              <span
                className="px-2.5 py-1 rounded-full text-xs font-semibold
                               bg-yellow-400/90 text-black ring-1 ring-yellow-300"
              >
                ⭐ {detail.vote_average.toFixed(1)}
              </span>
            ) : null}
          </div>

          {detail.genres?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {detail.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 rounded-full text-xs bg-indigo-500/90 text-white
                             shadow hover:bg-indigo-400 transition"
                >
                  {g.name}
                </span>
              ))}
            </div>
          ) : null}

          {detail.tagline && (
            <p className="mt-4 text-white/80 italic">“{detail.tagline}”</p>
          )}
        </div>
      </div>
    </section>
  );
}
