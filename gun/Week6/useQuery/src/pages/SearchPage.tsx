import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer"; // useInView 사용

// PAGINATION_ORDER를 타입으로만 Import 합니다.
import type { PAGINATION_ORDER } from "../enums/common"; 
import type { Lp } from '../type/lp'; // Lp 타입 import

// ✅ 경로 대소문자 수정: useGetInfiniteLpList

// ❌ LpCard의 내부 정의를 제거하고 외부 파일에서 Import 합니다.
import LpCard from "../components/LpCard"; 
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLPlist";
import LpCardSkeleton from "../components/LpCardSkeleton";

// ✅ 이전 오류 방지를 위해 Named Import로 변경 (export { LpCardSkeleton } from '...')


// 🚨 로컬 LpCard 정의는 제거되었습니다.


const SearchPage = () => {
    const [search, setSearch] = useState("");

    // 훅 호출 시 문자열 리터럴 'desc'를 직접 사용합니다.
    const {
        data: lps,
        isFetching,
        hasNextPage,
        isPending, // 초기 로딩 상태
        fetchNextPage,
        isError,
    // 'desc'를 PAGINATION_ORDER 타입으로 캐스팅하여 타입 안정성을 확보합니다.
    } = useGetInfiniteLpList(10, search, 'desc' as PAGINATION_ORDER); 

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

    return (
        <div className="container mx-auto px-4 py-6">
            <input 
                type="text"
                className="p-2 border rounded shadow-sm mb-6 w-full"
                placeholder="검색어를 입력하세요..."
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
            />
            
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