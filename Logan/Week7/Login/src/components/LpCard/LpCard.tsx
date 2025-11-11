// import { useNavigate, useNavigation } from "react-router-dom";
// import type { Lp } from "../../types/lp";

// interface LpCardProps {
//   lp: Lp;
// }

// const LpCard = ({ lp }: LpCardProps) => {
//   const cardDate = lp.createdAt;

//   const navigate = useNavigate();
//   return (
//     <div
//       onClick={() => navigate(`/lps/${lp.id}`)}
//       className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl>
//           transition-shadow duration-300 cursor-pointer"
//     >
//       <img
//         src={lp.thumbnail}
//         alt={lp.title}
//         className="object-cover w-full h-48"
//       />
//       <div className="absolute bottom-0 let-0 right-0 bg-black bg-opacity-75 p-2">
//         <h3 className="text-white text-sm font-semibold">{lp.title}</h3>
//       </div>
//     </div>
//   );
// };

// export default LpCard;

import { Link } from "react-router-dom";
import type { Lp } from "../../types/lp";

interface LpCardProps {
  lp: Lp;
}

// 날짜 년도,월,일 형태로 바꾸기
function formatDate(input: Date | string) {
  try {
    const d = typeof input === "string" ? new Date(input) : input;
    return isNaN(d.getTime())
      ? ""
      : d.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
  } catch {
    return "";
  }
}

export default function LpCard({ lp }: LpCardProps) {
  const likeCount = lp.likes?.length ?? 0; // 좋아요 개수: 배열 길이로 계산
  const created = formatDate(lp.createdAt); // 받아온 날짜 createAt 포매팅

  return (
    <Link
      to={`/lps/${lp.id}`}
      aria-label={`${lp.title} 상세보기`}
      className="group block"
    >
      <div
        className="
          relative overflow-hidden rounded-xl shadow-lg
          transition duration-300 ease-out
          hover:shadow-2xl
        "
      >
        {/* 이미지: 살짝 확대되는 효과 */}
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="
            h-48 w-full object-cover
            transition-transform duration-300 ease-out
            group-hover:scale-105
          "
          loading="lazy"
        />

        {/* 오버레이: 어둡게 + 그라데이션 */}
        <div
          className="
            pointer-events-none
            absolute inset-0
            bg-black/0 group-hover:bg-black/40
            transition-colors duration-300
          "
        />

        {/* 메타 정보 패널: 제목/업로드일/좋아요 */}
        <div
          className="
            absolute inset-x-0 bottom-0
            translate-y-3 opacity-0
            group-hover:translate-y-0 group-hover:opacity-100
            transition-all duration-300
            p-3
          "
        >
          <div
            className="
              rounded-lg bg-black/60 backdrop-blur
              text-white
              px-3 py-2
            "
          >
            <h3 className="text-sm font-semibold line-clamp-1">{lp.title}</h3>
            <div className="mt-1 flex items-center gap-3 text-[12px] text-gray-200">
              <span className="whitespace-nowrap">업로드: {created}</span>
              <span className="inline-flex items-center gap-1">
                {/* 하트 아이콘 (SVG) */}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                >
                  <path d="M12.1 21.35c-.1.06-.2.06-.3 0-4.9-3.2-8.1-6-9.6-8.7C.3 9.8 1 6.7 3.3 5.2 5 4 7.2 4.3 8.7 5.7l.3.3.3-.3c1.5-1.4 3.7-1.7 5.4-.5 2.3 1.5 3 4.6 1.7 7.45-1.6 2.7-4.8 5.5-9.3 8.7z" />
                </svg>
                {likeCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
