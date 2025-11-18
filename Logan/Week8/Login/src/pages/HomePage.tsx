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

const HomePage = () => {
  const [search, setSearch] = useState("");

  const debouncedValue = useDebounce(search, SEARCH_DEBOUNCE_DELAY);
  // const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isFetching, hasNextPage, isPending, fetchNextPage, isError } =
    useGetInfiniteLpList(10, debouncedValue, PAGINATION_ORDER.desc);

  // inview 컴포넌트를 읽는게 아니라, 불린값을 읽어오도록
  const { ref, inView } = useInView({
    root: null,
    rootMargin: "400px 0px",
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  const items = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.data.data);
  }, [data]);

  if (isPending) return <div className="mt-20">Loading...</div>;
  if (isError) return <div className="mt-20">Error...</div>;

  return (
    <div className="container mx-auto px-4 py-20">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => console.log("✅ input focus")}
        onBlur={() => console.log("❌ input blur")}
        placeholder="인풋창입니다.."
        className="border rounded px-3 py-2 mb-4 w-full"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((lp) => (
          <LpCard key={lp.id} lp={lp} />
        ))}

        {/* 다음 페이지 준비 중일 때만 스켈레톤 */}
        {isFetching && hasNextPage && <LpCardSkeletonList count={8} />}
      </div>

      {/* sentinel: 다음 페이지가 있을 때만 감시 */}
      {hasNextPage && <div ref={ref} className="h-4" />}
      <FloatingButton />
    </div>
  );
};

export default HomePage;
