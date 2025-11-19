import type { Lp } from "../type/lp";

interface LpCardProps {
    lp:Lp;
}

// ✅ LpCard 컴포넌트를 사용자님의 디자인에 맞춰 재정의합니다.
const LpCard = ({lp}:LpCardProps) => (
    <div 
        // 사용자님의 스크린샷에 포함된 Tailwind CSS 클래스 적용
        className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
    >
        <img
            src={lp.thumbnail}
            alt={lp.title}
            // 사용자님의 스크린샷에 포함된 Tailwind CSS 클래스 적용
            className="object-cover w-full h-48" 
            // 이미지 로드 실패 시 플레이스홀더 처리
            onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/400x300/e0e0e0/333333?text=No+Image';
            }}
        />
        {/* 하단 타이틀 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2">
            <h3 className="text-white text-sm font-semibold truncate">{lp.title}</h3>
        </div>
    </div>
);

export default LpCard;