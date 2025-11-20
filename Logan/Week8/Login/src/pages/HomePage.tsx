import React, { useEffect, useMemo, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import LpCard from "../components/LpCard/LpCard";
import FloatingButton from "../components/FloatingButton";
import useDebounce from "../hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/delay";
import useThrottle from "../hooks/useThrottle";
import useThrottleFn from "../hooks/useThrottleFn";

const HomePage = () => {
  const [search, setSearch] = useState("");

  // 1) 입력값 디바운스
  const debouncedValue = useDebounce(search, SEARCH_DEBOUNCE_DELAY);
  const trimmed = debouncedValue.trim();

  const isSearchActive = trimmed.length > 0; // 공백 빼고 글자가 있는지

  // 사용자가 입력하면,
  // 2) 기본 피드 쿼리 (search 없음)
  const baseQuery = useGetInfiniteLpList(10, "", PAGINATION_ORDER.desc, {
    enabled: !isSearchActive, // 검색 중일 땐 기본 피드 OFF
  });

  // 3) 검색 쿼리
  const searchQuery = useGetInfiniteLpList(10, trimmed, PAGINATION_ORDER.desc, {
    enabled: isSearchActive, // 공백이 아닌 검색어 있을 때만 요청 나감
  });

  // 처음 공백일때는 기본피드 쿼리(true)-> 실행됨/ 검색쿼리(false)-> 실행되지않음

  // 4) 지금 화면에 보여줄 "활성 쿼리" 선택
  const activeQuery = isSearchActive ? searchQuery : baseQuery;

  const { data, isFetching, hasNextPage, isPending, isError, fetchNextPage } =
    activeQuery;

  // useInview에서 inView는 ref달아준 요소가 화면안에 들어오면 true, 나가면 false
  const { ref, inView } = useInView({
    root: null,
    rootMargin: "400px 0px",
    threshold: 0,
  });

  // week8미션2.throttle훅 적용하기 시도1
  //  inView: 감시용 센티넬 박스가 화면에 보이면,
  // const throttledInView = useThrottle(inView, 3000);

  // 5) 무한스크롤 - 현재 활성 쿼리에만 적용

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  // 미션2 시도1(inView에 throttle해보기)
  // useEffect(() => {
  //   if (throttledInView && !isFetching && hasNextPage) {
  //     fetchNextPage();
  //   }
  // }, [throttledInView, isFetching, hasNextPage, fetchNextPage]);

  // 시도2. fetch를 throttle로 처리해보자(콜백함수 인자받는 useThrottleFn 만들기)
  // fetchNextPage를 1초에 한 번만 실행되도록 쓰로틀링
  // const throttledFetchNextPage = useThrottleFn(fetchNextPage, 1000);
  // useEffect(() => {
  //   if (inView && !isFetching && hasNextPage) {
  //     throttledFetchNextPage();
  //   }
  // }, [inView, isFetching, hasNextPage, throttledFetchNextPage]);

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
