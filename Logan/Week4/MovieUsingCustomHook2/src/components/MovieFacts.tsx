// // src/components/MovieFacts.tsx
// import React from "react";
// import type { MovieDetail } from "../types/MovieDetail";

// function minutesToHMM(min?: number): string {
//   if (min === undefined || min === null) return "-";
//   const h = Math.floor(min / 60);
//   const m = min % 60;
//   return h > 0 ? `${h}h ${m}m` : `${m}m`;
// }

// export default function MovieFacts({
//   detail,
//   className,
// }: {
//   detail: MovieDetail;
//   className?: string;
// }) {
//   const genres = detail.genres?.map((g) => g.name).join(", ") || "-";
//   const countries =
//     detail.production_countries?.map((c) => c.iso_3166_1).join(", ") || "-";

//   const rootClass =
//     "grid md:grid-cols-2 gap-6" + (className ? ` ${className}` : "");

//   return (
//     <section className={rootClass}>
//       <div className="rounded-xl border p-5">
//         <h3 className="font-semibold mb-3">Facts</h3>
//         <ul className="space-y-2 text-sm">
//           <li>
//             <span className="text-gray-500 w-28 inline-block">Release</span>
//             <span>{detail.release_date || "-"}</span>
//           </li>
//           <li>
//             <span className="text-gray-500 w-28 inline-block">Runtime</span>
//             <span>{minutesToHMM(detail.runtime)}</span>
//           </li>
//           <li>
//             <span className="text-gray-500 w-28 inline-block">Genres</span>
//             <span>{genres}</span>
//           </li>
//           <li>
//             <span className="text-gray-500 w-28 inline-block">Countries</span>
//             <span>{countries}</span>
//           </li>
//           <li>
//             <span className="text-gray-500 w-28 inline-block">IMDB</span>
//             <span>{detail.imdb_id ?? "-"}</span>
//           </li>
//         </ul>
//       </div>

//       <div className="rounded-xl border p-5">
//         <h3 className="font-semibold mb-3">Financials</h3>
//         <ul className="space-y-2 text-sm">
//           <li>
//             <span className="text-gray-500 w-28 inline-block">Budget</span>
//             <span>
//               {detail.budget ? `$${detail.budget.toLocaleString()}` : "-"}
//             </span>
//           </li>
//           <li>
//             <span className="text-gray-500 w-28 inline-block">Revenue</span>
//             <span>
//               {detail.revenue ? `$${detail.revenue.toLocaleString()}` : "-"}
//             </span>
//           </li>
//           <li>
//             <span className="text-gray-500 w-28 inline-block">Popularity</span>
//             <span>{Math.round(detail.popularity)}</span>
//           </li>
//         </ul>
//       </div>
//     </section>
//   );
// }

// src/components/MovieFacts.tsx
import React from "react";
import type { MovieDetail } from "../types/MovieDetail";

function minutesToHMM(min?: number): string {
  if (min === undefined || min === null) return "-";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function MovieFacts({
  detail,
  className,
}: {
  detail: MovieDetail;
  className?: string;
}) {
  const genres = detail.genres?.map((g) => g.name).join(", ") || "-";
  const countries =
    detail.production_countries?.map((c) => c.iso_3166_1).join(", ") || "-";

  const rootClass =
    "grid md:grid-cols-2 gap-6" + (className ? ` ${className}` : "");

  return (
    <section className={rootClass}>
      <div className="rounded-xl border p-5">
        <h3 className="font-semibold mb-3">Facts</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <span className="text-gray-500 w-28 inline-block">Release</span>
            <span>{detail.release_date || "-"}</span>
          </li>
          <li>
            <span className="text-gray-500 w-28 inline-block">Runtime</span>
            <span>{minutesToHMM(detail.runtime)}</span>
          </li>
          <li>
            <span className="text-gray-500 w-28 inline-block">Genres</span>
            <span>{genres}</span>
          </li>
          <li>
            <span className="text-gray-500 w-28 inline-block">Countries</span>
            <span>{countries}</span>
          </li>
          <li>
            <span className="text-gray-500 w-28 inline-block">IMDB</span>
            <span>{detail.imdb_id ?? "-"}</span>
          </li>
        </ul>
      </div>

      <div className="rounded-xl border p-5">
        <h3 className="font-semibold mb-3">Financials</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <span className="text-gray-500 w-28 inline-block">Budget</span>
            <span>
              {detail.budget ? `$${detail.budget.toLocaleString()}` : "-"}
            </span>
          </li>
          <li>
            <span className="text-gray-500 w-28 inline-block">Revenue</span>
            <span>
              {detail.revenue ? `$${detail.revenue.toLocaleString()}` : "-"}
            </span>
          </li>
          <li>
            <span className="text-gray-500 w-28 inline-block">Popularity</span>
            <span>{Math.round(detail.popularity)}</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
