// 파일: SearchPage.tsx (수정된 최종 코드)

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { PAGINATION_ORDER } from "../enums/common"; 
import type { Lp } from '../type/lp'; 
import LpCard from "../components/LpCard"; 
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLPlist";
import LpCardSkeleton from "../components/LpCardSkeleton";
import useDebounce from "../hooks/usedebounce"; // Debounce 훅 사용
import { SEARCH_DEBOUNCED_DELAY } from "../constants/delay";

const SearchPage = () => {
    const [search, setSearch] = useState("");
    const debouncedValue = useDebounce(search, SEARCH_DEBOUNCED_DELAY); // Debounce 값 사용

    const [order, setOrder] = useState<PAGINATION_ORDER>('desc' as PAGINATION_ORDER); 

    const {
        data: lps,
        isFetching,
        hasNextPage,
        isPending, // 초기 로딩 상태
        fetchNextPage,
        isError,
    } = useGetInfiniteLpList(12, debouncedValue, order); // Debounced 값 전달

    const { ref, inView } = useInView({
        threshold: 0,
    });

    const allLps: Lp[] = lps?.pages
        ?.map((page) => page.data.data) 
        ?.flat() ?? []; 

    useEffect(() => {
        if (inView && hasNextPage && !isFetching) {
            fetchNextPage();
        }
    }, [inView, isFetching, hasNextPage, fetchNextPage]); 

    const isFetchingMore = isFetching && !isPending;

    const handleOrderChange = (newOrder: PAGINATION_ORDER) => {
        if (newOrder !== order) {
            setOrder(newOrder);
        }
    };

    // 🛑 1. isError 상태는 가장 먼저 분기하여 전체 컴포넌트를 대체합니다.
    if (isError) {
        return <div className={"mt-20 text-center text-red-500 text-xl"}>Error fetching data.</div>;
    }

    const activeClass = "bg-indigo-600 text-white shadow-md";
    const inactiveClass = "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300";


    return (
        <div className="container mx-auto px-4 py-6">
            
            {/* ⭐️ 2. input 필드를 isPending 조건문 밖에 배치하여 DOM을 안정화합니다. */}
            <input 
                type="text"
                className="p-2 border rounded shadow-sm mb-6 w-full"
                placeholder="검색어를 입력하세요..."
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                disabled={isError}

            />
            
            {/* ⭐ 정렬 버튼 섹션 유지 ⭐ */}
            <div className="flex justify-start space-x-2 mb-6">
                <button
                    onClick={() => handleOrderChange('desc' as PAGINATION_ORDER)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition duration-150 ${
                        order === 'desc' ? activeClass : inactiveClass
                    }`}
                >
                    최신순
                </button>
                <button
                    onClick={() => handleOrderChange('asc' as PAGINATION_ORDER)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition duration-150 ${
                        order === 'asc' ? activeClass : inactiveClass
                    }`}
                >
                    오래된순
                </button>
            </div>
            
            {/* ⭐️ 3. isPending일 때와 아닐 때 LP 목록 부분만 조건부 렌더링합니다. */}
            {isPending ? (
                // 🛑 초기 로딩 중일 때: 스켈레톤 목록만 보여줍니다.
                <div
                    className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}
                >
                    {Array.from({ length: 8 }).map((_, index) => (
                        <LpCardSkeleton key={index} />
                    ))}
                </div>
            ) : (
                // ✅ 로딩 완료 후: 실제 LP 목록을 보여줍니다.
                <>
                    <div
                        className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}
                    >
                        {/* 평탄화된 LP 목록 렌더링 */}
                        {allLps.map((lp) => (
                            <LpCard key={lp.id} lp={lp} />
                        ))}
                        
                        {/* 데이터가 없을 때 메시지 */}
                        {allLps.length === 0 && !isFetchingMore && (
                            <div className="col-span-full text-center text-gray-500 p-8 border border-dashed rounded-lg">
                                검색 결과가 없습니다.
                            </div>
                        )}

                        {/* 다음 페이지 로딩 시: 스켈레톤 2개 렌더링 */}
                        {isFetchingMore && (
                            <>
                                <LpCardSkeleton key="skel-1" />
                                <LpCardSkeleton key="skel-2" />
                            </>
                        )}
                    </div>
                    
                    {/* 무한 스크롤 관찰자 ref */}
                    <div ref={ref} className="h-10 my-4 text-center">
                    </div>

                    {/* 모든 페이지를 다 로드했고, 목록이 있을 때 표시 */}
                    {!hasNextPage && allLps.length > 0 && (
                        <div className="text-center text-gray-400 mt-8">-- 모든 목록을 불러왔습니다 --</div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchPage;