
// // src/components/MovieDetailHero.tsx
// import React, { type JSX } from "react";
// import type { MovieDetail } from "../types/MovieDetail";

// const IMG_BASE = "https://image.tmdb.org/t/p";
// // 기본 사이즈를 w342로 줄여서 다운받는 데이터 자체를 가볍게
// const posterUrl = (path?: string | null, size: "w185" | "w342" | "w500" = "w342") =>
//   path ? `${IMG_BASE}/${size}${path}` : "";

// export default function MovieDetailHero({
//   detail,
// }: {
//   detail: MovieDetail;
// }): JSX.Element {
//   return (
//     // 왼쪽 포스터 컬럼 폭을 더 좁게: 160px
//     <section className="grid grid-cols-1 md:grid-cols-[160px,1fr] gap-6">
//       {/* 포스터 래퍼: 가운데 정렬 + 고정폭 */}
//       <div className="justify-self-center md:justify-self-start">
//         {detail.poster_path ? (
//           <img
//             src={posterUrl(detail.poster_path, "w342")} // 필요시 "w185"로 더 작게
//             alt={detail.title}
//             // 폭 제한: 모바일 w-36(144px), 데스크톱 w-40(160px) + 비율 유지
//             className="w-36 md:w-40 h-auto rounded-xl shadow-md object-cover"
//             loading="lazy"
//           />
//         ) : (
//           <div className="w-36 md:w-40 h-[216px] bg-gray-200 rounded-xl" />
//         )}
//       </div>

//       <div className="flex flex-col justify-center">
//         <h1 className="text-2xl md:text-3xl font-bold">{detail.title}</h1>
//         {detail.tagline && (
//           <p className="text-gray-500 mt-2 italic">“{detail.tagline}”</p>
//         )}

//         <div className="mt-4 flex flex-wrap items-center gap-3">
//           <span className="inline-block text-sm px-2 py-1 rounded-md bg-gray-100">
//             {detail.original_language.toUpperCase()}
//           </span>
//           <span className="inline-block text-sm px-2 py-1 rounded-md bg-gray-100">
//             Rating ⭐ {detail.vote_average.toFixed(1)} / 10
//           </span>
//           <span className="inline-block text-sm px-2 py-1 rounded-md bg-gray-100">
//             Votes {detail.vote_count.toLocaleString()}
//           </span>
//           {detail.status && (
//             <span className="inline-block text-sm px-2 py-1 rounded-md bg-gray-100">
//               {detail.status}
//             </span>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }


// src/components/MovieDetailHero.tsx
import React from "react";
import type { MovieDetail } from "../types/MovieDetail";

interface MovieDetailHeroProps {
  detail: MovieDetail;
}

const IMG_BASE = "https://image.tmdb.org/t/p";
const posterUrl = (path?: string | null, size: "w185" | "w342" | "w500" = "w342") =>
  path ? `${IMG_BASE}/${size}${path}` : "";

export default function MovieDetailHero({ detail }: MovieDetailHeroProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-[160px,1fr] gap-6">
      <div className="justify-self-center md:justify-self-start">
        {detail.poster_path ? (
          <img
            src={posterUrl(detail.poster_path, "w342")}
            alt={detail.title}
            className="w-36 md:w-40 h-auto rounded-xl shadow-md object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-36 md:w-40 h-[216px] bg-gray-200 rounded-xl" />
        )}
      </div>

      <div className="flex flex-col justify-center">
        <h1 className="text-2xl md:text-3xl font-bold">{detail.title}</h1>
        {detail.tagline && <p className="text-gray-500 mt-2 italic">“{detail.tagline}”</p>}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-block text-sm px-2 py-1 rounded-md bg-gray-100">
            {detail.original_language.toUpperCase()}
          </span>
          <span className="inline-block text-sm px-2 py-1 rounded-md bg-gray-100">
            Rating ⭐ {detail.vote_average.toFixed(1)} / 10
          </span>
          <span className="inline-block text-sm px-2 py-1 rounded-md bg-gray-100">
            Votes {detail.vote_count.toLocaleString()}
          </span>
          {detail.status && (
            <span className="inline-block text-sm px-2 py-1 rounded-md bg-gray-100">
              {detail.status}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
