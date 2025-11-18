import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer"; // useInView 사용

// PAGINATION_ORDER를 타입으로만 Import 합니다.
import type { PAGINATION_ORDER } from "../enums/common"; 
import type { Lp } from '../type/lp'; // Lp 타입 import

import LpCard from "../components/LpCard"; 
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLPlist";
import LpCardSkeleton from "../components/LpCardSkeleton";



const SearchPage = () => {
    const [search, setSearch] = useState("");
    // ⭐ 1. 정렬 순서를 관리하는 상태 추가 (기본값: 최신순 'desc') ⭐
    const [order, setOrder] = useState<PAGINATION_ORDER>('desc' as PAGINATION_ORDER); 

    // 2. 훅 호출 시 hardcoded 'desc' 대신 order 상태 전달
    const {
        data: lps,
        isFetching,
        hasNextPage,
        isPending, // 초기 로딩 상태
        fetchNextPage,
        isError,
    } = useGetInfiniteLpList(10, search, order); // order 상태를 훅에 전달

    // useInView 훅 설정 (자동 로드를 위한 관찰자)
    const { ref, inView } = useInView({
        threshold: 0, // 뷰포트에 0%만 들어와도 감지
    });

    // 데이터 평탄화 (모든 페이지의 LP 목록을 하나의 배열로)
    const allLps: Lp[] = lps?.pages
        ?.map((page) => page.data.data) // 각 페이지에서 실제 Lp[] 목록을 추출
        ?.flat() ?? []; // 모든 페이지를 병합하고, 데이터가 없을 경우 빈 배열로 처리

    // inView 상태에 따라 다음 페이지 로드
    useEffect(() => {
        // isFetching 중이 아니고, 다음 페이지가 있으며, 관찰자 요소가 뷰에 들어왔을 때만 fetchNextPage 호출
        if (inView && hasNextPage && !isFetching) {
            fetchNextPage();
        }
    }, [inView, isFetching, hasNextPage, fetchNextPage]); 

    const isFetchingMore = isFetching && !isPending; // 다음 페이지 로딩 중

    // ⭐ 3. 정렬 순서 변경 핸들러 ⭐
    const handleOrderChange = (newOrder: PAGINATION_ORDER) => {
        if (newOrder !== order) {
            setOrder(newOrder);
            // order 상태가 변경되면 useGetInfiniteLpList의 queryKey가 변경되어 자동으로 새로운 데이터가 로드됩니다.
        }
    };


    // 🛑 초기 로딩 처리 (isPending) - 스켈레톤으로 대체
    if (isPending) {
        return (
            <div className="container mx-auto px-4 py-6">
                 <input 
                    type="text"
                    className="p-2 border rounded shadow-sm mb-6 w-full"
                    placeholder="검색어를 입력하세요..."
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    disabled // 로딩 중에는 검색창 비활성화
                />
                <div
                    className={
                        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    }
                >
                    {/* 1. 초기 로딩 시: 8개의 스켈레톤 카드 렌더링 */}
                    {Array.from({ length: 8 }).map((_, index) => (
                        <LpCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return <div className={"mt-20 text-center text-red-500 text-xl"}>Error fetching data.</div>;
    }

    // 4. 활성화된 버튼 스타일
    const activeClass = "bg-indigo-600 text-white shadow-md";
    const inactiveClass = "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300";


    return (
        <div className="container mx-auto px-4 py-6">
            <input 
                type="text"
                className="p-2 border rounded shadow-sm mb-6 w-full"
                placeholder="검색어를 입력하세요..."
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
            />
            
            {/* ⭐ 정렬 버튼 섹션 추가 ⭐ */}
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
            
            <div
                className={
                    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                }
            >
                {/* 평탄화된 LP 목록 렌더링 */}
                {allLps.map((lp) => (
                    // LpCard는 이제 외부 파일에서 가져온 컴포넌트를 사용하며, LpCard 내부에 이미지 로딩 스켈레톤 로직이 포함되어 있습니다.
                    <LpCard key={lp.id} lp={lp} />
                ))}
                
                {/* 데이터가 없을 때 메시지 */}
                {allLps.length === 0 && !isFetchingMore && (
                     <div className="col-span-full text-center text-gray-500 p-8 border border-dashed rounded-lg">
                        검색 결과가 없습니다.
                    </div>
                )}

                {/* 2. 다음 페이지 로딩 시: 스켈레톤 2개 렌더링 (텍스트 메시지 대체) */}
                {isFetchingMore && (
                    <>
                        <LpCardSkeleton key="skel-1" />
                        <LpCardSkeleton key="skel-2" />
                    </>
                )}
            </div>
            
            {/* 무한 스크롤 관찰자 ref: isFetchingMore 시 로딩 텍스트가 필요 없습니다. */}
            <div ref={ref} className="h-10 my-4 text-center">
                {/* isFetchingMore일 때 스켈레톤으로 대체했으므로 여기는 비워둡니다. */}
            </div>

            {/* 모든 페이지를 다 로드했고, 목록이 있을 때 표시 */}
            {!hasNextPage && allLps.length > 0 && (
                <div className="text-center text-gray-400 mt-8">-- 모든 목록을 불러왔습니다 --</div>
            )}
        </div>
    );
};

export default SearchPage;