import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query'; 
import React from 'react'; 
import type { PaginationDto } from '../type/common'; 
import useGetLpList from '../hooks/queries/useGetLPList'; 

// ❌ LpSkeletonCard 컴포넌트 정의가 제거됨


const SearchPage = () => {
    const queryClient = useQueryClient(); 
    
    // 쿼리 매개변수 상태 관리: limit은 9로 수정
    const [queryParams, setQueryParams] = useState<PaginationDto>({ 
        cursor: undefined, 
        limit: 9, // limit을 9로 유지
        search: undefined, 
        order: 'desc',
    });

    const [searchTerm, setSearchTerm] = useState(''); 

    const { 
        data: lpResponse, 
        isLoading, 
        isError,
        isFetching,
    } = useGetLpList(queryParams);

    // 데이터 안전하게 추출 (LpItem 타입 명시 제거)
    const lpList = lpResponse?.data?.data || []; 
    
    // hasNextPage와 nextCursor는 CursorBasedResponse에서 추출
    const hasNextPage = lpResponse?.hasNext ?? false; 
    const nextCursor = lpResponse?.nextCursor;

    // 디버깅 로그 (유지)
    console.log("--- SearchPage Debugging ---");
    console.log("LP List Array Length:", lpList.length);
    console.log("isFetching:", isFetching);
    console.log("hasNextPage:", hasNextPage);
    console.log("nextCursor:", nextCursor);
    console.log("----------------------------");

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newSearch = searchTerm.trim() || undefined;
        queryClient.invalidateQueries({ queryKey: ['lps'] }); 

        setQueryParams(prev => ({
            ...prev,
            search: newSearch, 
            cursor: undefined, // 검색 시 커서 초기화
        }));
    };
    
    // handleLoadMore 로직: 다음 페이지 로딩
    const handleLoadMore = () => {
        if (hasNextPage && nextCursor !== undefined) {
            setQueryParams(prev => ({
                ...prev,
                cursor: nextCursor, // 다음 커서 값으로 업데이트
            }));
        }
    };
    
    // 7. 로딩 및 에러 상태 처리
    if (isLoading) {
        // ⭐ 최초 로딩 시 로딩 메시지만 반환
        return <div className="text-center py-10 text-xl font-medium text-gray-600">데이터를 처음 로딩 중입니다...</div>;
    }

    if (isError) {
        return <div className="text-center py-10 text-xl font-medium text-red-600">데이터를 불러오는 데 실패했습니다.</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">LP 검색 페이지</h2>

            {/* 검색 폼 */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} 
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b2dab1]"
                />
                <button
                    type="submit"
                    className="px-6 py-3 bg-[#b2dab1] text-gray-900 font-semibold rounded-lg hover:bg-[#97d896] transition disabled:opacity-50"
                    disabled={isFetching}
                >
                    {isFetching ? '검색 중...' : '검색'}
                </button>
            </form>

            {/* LP 목록 표시 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lpList.length > 0 ? (
                    // LP 목록을 map으로 렌더링
                    lpList.map((lp: any) => (
                        <div key={lp.id} className="bg-white p-5 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
                            <h3 className="text-xl font-semibold mb-2 truncate">{lp.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{lp.content}</p>
                            <div className="mt-3 text-xs text-gray-500 flex justify-between items-center">
                                <span>작성자 ID: {lp.authorId}</span>
                                <span>좋아요: {lp.likes?.length || 0}</span>
                            </div>
                            <Link to={`/lp/${lp.id}`} className="mt-3 inline-block text-[#b2dab1] hover:text-[#97d896] font-medium">
                                자세히 보기
                            </Link>
                        </div>
                    ))
                ) : (
                    // ⭐ 데이터가 없고 fetch 중일 때 로딩 인디케이터 표시
                    isFetching ? (
                        <p className="col-span-full text-center text-gray-500 p-8 border border-dashed rounded-lg">
                            다음 목록 로딩 중...
                        </p>
                    ) : (
                        <p className="col-span-full text-center text-gray-500 p-8 border border-dashed rounded-lg">
                            검색 결과가 없습니다.
                        </p>
                    )
                )}
            </div>

            {/* 더 보기 버튼 */}
            {hasNextPage && (
                <div className="text-center mt-10">
                    <button
                        onClick={handleLoadMore}
                        disabled={isFetching}
                        className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 disabled:opacity-50"
                    >
                        {isFetching ? '다음 목록 로딩 중...' : '다음 페이지 보기'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchPage;