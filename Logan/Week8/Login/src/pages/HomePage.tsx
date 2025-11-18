import React, { useEffect, useMemo, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import LpCard from "../components/LpCard/LpCard";
import FloatingButton from "../components/FloatingButton";
import useDebounce from "../hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/delay";

// function useDebouncedValue<T>(value: T, delay = 300) {
//   const [v, setV] = useState(value);

//   useEffect(() => {
//     const t = setTimeout(() => setV(value), delay);
//     return () => clearTimeout(t);
//   }, [value, delay]);
//   return v;
// }

// const HomePage = () => {
//   const [search, setSearch] = useState("");

//   const debouncedValue = useDebounce(search, SEARCH_DEBOUNCE_DELAY);
//   // const debouncedSearch = useDebouncedValue(search, 300);
//   const trimmed = debouncedValue.trim();
//   const isSearchActive = trimmed.length > 0;

//   const { data, isFetching, hasNextPage, isPending, fetchNextPage, isError } =
//     useGetInfiniteLpList(10, debouncedValue, PAGINATION_ORDER.desc);

//   // inview 컴포넌트를 읽는게 아니라, 불린값을 읽어오도록
//   const { ref, inView } = useInView({
//     root: null,
//     rootMargin: "400px 0px",
//     threshold: 0,
//   });

//   useEffect(() => {
//     if (inView && !isFetching && hasNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, isFetching, hasNextPage, fetchNextPage]);

//   const items = useMemo(() => {
//     const pages = data?.pages ?? [];
//     return pages.flatMap((p) => p.data.data);
//   }, [data]);

//   // if (isPending) return <div className="mt-20">Loading...</div>;
//   if (isError) return <div className="mt-20">Error...</div>;

//   //  return (
//   //     <div className="container mx-auto px-4 py-20">
//   //       <input
//   //         value={search}
//   //         onChange={(e) => setSearch(e.target.value)}
//   //         onFocus={() => console.log("✅ input focus")}
//   //         onBlur={() => console.log("❌ input blur")}
//   //         placeholder="인풋창입니다.."
//   //         className="border rounded px-3 py-2 mb-4 w-full"
//   //       />

//   //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//   //         {items.map((lp) => (
//   //           <LpCard key={lp.id} lp={lp} />
//   //         ))}

//   //         {/* 다음 페이지 준비 중일 때만 스켈레톤 */}
//   //         {isFetching && hasNextPage && <LpCardSkeletonList count={8} />}
//   //       </div>

//   //       {/* sentinel: 다음 페이지가 있을 때만 감시 */}
//   //       {hasNextPage && <div ref={ref} className="h-4" />}
//   //       <FloatingButton />
//   //     </div>
//   //   );
//   // };

// isPending일때 아예 피드를 안보여줘버림
//   return (
//     <div className="container mx-auto px-4 py-20">
//       <input
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="검색어를 입력하세요"
//         className="border rounded px-3 py-2 mb-4 w-full"
//       />

//       {/* 1) 검색어가 아예 없을 때 */}
//       {!isSearchActive && (
//         <p className="text-gray-500 mt-4">검색어를 입력하면 결과가 보여요.</p>
//       )}

//       {/* 2) 검색어는 있는데, 아직 서버 응답 기다리는 중일 때 */}
//       {isSearchActive && isPending && <div className="mt-20">Loading...</div>}

//       {/* 3) 검색어 있고, 데이터도 도착했을 때 */}
//       {isSearchActive && !isPending && (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {items.map((lp) => (
//               <LpCard key={lp.id} lp={lp} />
//             ))}

//             {isFetching && hasNextPage && <LpCardSkeletonList count={8} />}
//           </div>

//           {hasNextPage && <div ref={ref} className="h-4" />}
//         </>
//       )}

//       <FloatingButton />
//     </div>
//   );
// };

const HomePage = () => {
  const [search, setSearch] = useState("");

  // 1) 입력값 디바운스
  const debouncedValue = useDebounce(search, SEARCH_DEBOUNCE_DELAY);
  const trimmed = debouncedValue.trim();
  const isSearchActive = trimmed.length > 0; // 공백 빼고 글자가 있는지

  // 2) 기본 피드 쿼리 (search 없음)
  const baseQuery = useGetInfiniteLpList(10, "", PAGINATION_ORDER.desc, {
    enabled: !isSearchActive, // 검색 중일 땐 기본 피드 OFF
  });

  // 3) 검색 쿼리
  const searchQuery = useGetInfiniteLpList(10, trimmed, PAGINATION_ORDER.desc, {
    enabled: isSearchActive, // ✅ 공백이 아닌 검색어 있을 때만 요청 나감
  });

  // 4) 지금 화면에 보여줄 "활성 쿼리" 선택
  const activeQuery = isSearchActive ? searchQuery : baseQuery;

  const { data, isFetching, hasNextPage, isPending, isError, fetchNextPage } =
    activeQuery;

  const { ref, inView } = useInView({
    root: null,
    rootMargin: "400px 0px",
    threshold: 0,
  });

  // 5) 무한스크롤 - 현재 활성 쿼리에만 적용
  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  const items = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.data.data);
  }, [data]);

  if (isError) return <div className="mt-20">Error...</div>;

  return (
    <div className="container mx-auto px-4 py-20">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="border rounded px-3 py-2 mb-4 w-full"
      />

      {/* isPending이어도 인풋/기본 레이아웃은 항상 보여주고, 안쪽에만 로딩 표시 */}
      {isPending && (
        <div className="mb-4 text-sm text-gray-500">Loading...</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((lp) => (
          <LpCard key={lp.id} lp={lp} />
        ))}

        {isFetching && hasNextPage && <LpCardSkeletonList count={8} />}
      </div>

      {hasNextPage && <div ref={ref} className="h-4" />}

      <FloatingButton />
    </div>
  );
};

export default HomePage;
