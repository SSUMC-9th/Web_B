
/**
 * LP 목록 카드와 동일한 레이아웃을 가진 스켈레톤 UI 컴포넌트입니다.
 * 목록이 로딩 중일 때 깜빡임을 방지하고 사용자 경험을 개선합니다.
 */
const LpCardSkeleton = () => {
    return (
        <div 
            // LpCard와 동일한 기본 레이아웃 적용
            className="relative rounded-lg overflow-hidden shadow-lg border border-gray-100 animate-pulse"
        >
            {/* 이미지 영역 스켈레톤 */}
            <div className="bg-gray-200 w-full h-48">
                {/* Tailwind CSS의 animate-pulse 클래스를 사용하여 깜빡이는 효과를 줍니다. */}
            </div>
            
            {/* 하단 타이틀 오버레이 스켈레톤 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-300 bg-opacity-75 p-2">
                {/* 타이틀 텍스트 라인 스켈레톤 */}
                <div className="h-4 bg-gray-400 rounded w-3/4"></div>
            </div>
        </div>
    );
};

export default LpCardSkeleton;