// // src/components/CompanyChips.tsx
// import React, { type JSX } from "react";
// import type { ProductionCompany } from "../types/MovieDetail"

// const IMG_BASE = "https://image.tmdb.org/t/p";
// const logoUrl = (path?: string | null) =>
//   path ? `${IMG_BASE}/w185${path}` : "";

// export default function CompanyChips({
//   companies,
// }: {
//   companies: ProductionCompany[];
// }): JSX.Element {
//   return (
//     <div className="flex flex-wrap gap-3">
//       {companies.map((c) => (
//         <div
//           key={c.id}
//           className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full"
//           title={c.name}
//         >
//           {c.logo_path ? (
//             <img
//               src={logoUrl(c.logo_path)}
//               alt={c.name}
//               className="h-6 w-auto"
//             />
//           ) : (
//             <div className="h-6 w-6 rounded-full bg-gray-300" />
//           )}
//           <span className="text-sm">{c.name}</span>
//         </div>
//       ))}
//     </div>
//   );
// }


// src/components/CompanyChips.tsx
import React from "react";
import type { ProductionCompany } from "../types/MovieDetail";

interface CompanyChipsProps {
  companies: ProductionCompany[];
}

const IMG_BASE = "https://image.tmdb.org/t/p";
const logoUrl = (path?: string | null) => (path ? `${IMG_BASE}/w185${path}` : "");

export default function CompanyChips({ companies }: CompanyChipsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {companies.map((c) => (
        <div
          key={c.id}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full"
          title={c.name}
        >
          {c.logo_path ? (
            <img src={logoUrl(c.logo_path)} alt={c.name} className="h-6 w-auto" />
          ) : (
            <div className="h-6 w-6 rounded-full bg-gray-300" />
          )}
          <span className="text-sm">{c.name}</span>
        </div>
      ))}
    </div>
  );
}
