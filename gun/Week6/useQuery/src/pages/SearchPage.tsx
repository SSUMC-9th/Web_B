import { useState } from 'react';
import { Link } from 'react-router-dom';
// ⭐ 1. 필요한 타입 임포트
import type { PaginationDto } from '../type/common'; 
import useGetLpList from '../hooks/queries/useGetLPList'; // useGetLpList 경로

const SearchPage = () => {
    // 2. 쿼리 매개변수 상태 관리에 PaginationDto 타입을 명시적으로 지정
    //    이제 order: 'desc'가 허용됩니다.
    const [queryParams, setQueryParams] = useState<PaginationDto>({ 
        cursor: undefined, 
        limit: 10,
        search: undefined, // 초기에는 undefined가 더 안전합니다.
        order: 'desc',
    });

    const [searchTerm, setSearchTerm] = useState(''); // 검색어 입력 필드 상태

    // 3. useGetLpList 훅 사용
    const { 
        data: lpResponse, 
        isLoading, 
        isError,
        isFetching,
    } = useGetLpList(queryParams);

    // 4. 데이터 안전하게 추출: data?.data?.data 구조를 가정 (타입 정의에 따름)
    //    data?.data는 ResponseLpListDto의 필드, data?.data?.data는 LpItem[] 배열
    const lpList = lpResponse?.data?.data || []; 
    const hasNextPage = lpResponse?.hasNext;
    const nextCursor = lpResponse?.nextCursor;
    
    console.log("--- SearchPage Debugging ---");
    console.log("LP Response Status (Simulated):", lpResponse?.statusCode || 'N/A');
    console.log("LP List Array Length:", lpList.length);
    console.log("----------------------------");
    // 5. 검색 버튼 클릭 핸들러
    // 🌟 수정: e에 React.FormEvent<HTMLFormElement> 타입 명시
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // searchTerm이 빈 문자열이면 undefined로 변환하여 DTO 타입에 맞춥니다.
        const newSearch = searchTerm.trim() || undefined;

        setQueryParams(prev => ({
            ...prev,
            search: newSearch, // 새 검색어 적용
            cursor: undefined, // 새 검색 시작 시 커서 초기화
        }));
    };
    
    // 6. '다음 페이지' 버튼 클릭 핸들러 (목록을 새로운 페이지로 교체)
    const handleLoadMore = () => {
        if (hasNextPage && nextCursor !== undefined) {
            setQueryParams(prev => ({
                ...prev,
                cursor: nextCursor,
            }));
        }
    };
    
    // 7. 로딩 및 에러 상태 처리
    if (isLoading) {
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
                    // 🌟 수정: onChange 핸들러의 e에 React.ChangeEvent<HTMLInputElement> 타입 명시
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
                    lpList.map(lp => (
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
                    <p className="col-span-full text-center text-gray-500 p-8 border border-dashed rounded-lg">
                        {isFetching ? '검색 결과를 찾는 중...' : '검색 결과가 없습니다.'}
                    </p>
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