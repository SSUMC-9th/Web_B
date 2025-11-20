import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import type { Lp } from "../type/lp";

interface LpCardProps {
    lp: Lp;
}

// 💡 Placeholder 이미지 URL 정의
const FALLBACK_IMAGE_URL = 'https://placehold.co/400x300/e0e0e0/333333?text=No+Image';

const LpCard = ({lp}:LpCardProps) => {
    const navigate = useNavigate();
    // 1. 이미지 로드 상태 관리
    const [imageLoaded, setImageLoaded] = useState(false);
    // 2. 이미지 URL 상태 관리 (로딩 실패 시 대체 이미지로 변경하기 위함)
    const [imageUrl, setImageUrl] = useState(lp.thumbnail);

    // 3. 로드 성공 핸들러
    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    // 4. 로드 실패 핸들러 (원본 이미지 경로에서 에러 발생 시)
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setImageLoaded(true);
        setImageUrl(FALLBACK_IMAGE_URL);
    };
    
    return(
    <div 
        onClick={() => navigate(`/lps/${lp.id}`)}
        className="
            relative rounded-lg overflow-hidden shadow-lg 
            
            // ⭐ 호버 스타일 추가:
            transform transition-all duration-300 ease-in-out 
            hover:scale-[1.03] 
            hover:shadow-2xl hover:shadow-indigo-500/60 
            hover:border-indigo-600 // 호버 시 테두리 색상 변경
            cursor-pointer 
            
            border-4 border-gray-300 // 기존 테두리 유지
        "
    >
        {/* 🖼️ 이미지 컨테이너 */}
        <div className="object-cover w-full h-48 relative bg-gray-200 ">
            
            {/* 💡 로딩 중일 때만 보이는 플레이스홀더 배경 */}
            {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
            )}

            {/* 실제 이미지 */}
            <img
                src={imageUrl} 
                alt={lp.title}
                className={`object-cover w-full h-48 transition-opacity duration-500 
                             ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} 
                onLoad={handleImageLoad} 
                onError={handleImageError} 
            />
        </div>

        {/* 하단 타이틀 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2 ">
            <h3 className="text-white text-sm font-semibold truncate">{lp.title}</h3>
        </div>
    </div>
    );
};

export default LpCard;