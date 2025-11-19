// src/components/HamburgerButton.tsx

interface HamburgerProps {
  onClick: () => void;
  isOpen: boolean;
}

const HamburgerButton = ({ onClick, isOpen }: HamburgerProps) => {
  return (
    <button 
      onClick={onClick} 
      className="relative z-50 p-2 rounded-lg hover:bg-gray-700 transition-colors"
      aria-expanded={isOpen}
      aria-label={isOpen ? "사이드바 닫기" : "사이드바 열기"}
    >
      <div className="w-6 h-5 flex flex-col justify-between">
        
        {/* 상단 바: 회전 및 이동하여 X자의 윗부분 형성 */}
        <span 
          className={`block h-0.5 w-full bg-gray-200 rounded transition-all duration-50 ${
            isOpen ? 'rotate-45 translate-y-2' : '' // 👈 rotate-45, translate-y-2 (아래로 이동)
          }`}
        ></span>
        
        {/* 중간 바: 투명도를 0으로 만들어 사라지게 함 */}
        <span 
          className={`block h-0.5 w-full bg-gray-200 rounded transition-all duration-50 ${
            isOpen ? 'opacity-0' : '' // 👈 opacity-0으로 변경
          }`}
        ></span>
        
        {/* 하단 바: 반대 방향으로 회전 및 이동하여 X자의 아랫부분 형성 */}
        <span 
          className={`block h-0.5 w-full bg-gray-200 rounded transition-all duration-50 ${
            isOpen ? '-rotate-45 -translate-y-2.5' : '' // 👈 -rotate-45, -translate-y-2 (위로 이동)
          }`}
        ></span>
      </div>
    </button>
  );
};

export default HamburgerButton;