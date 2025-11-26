import { useState, useCallback, useEffect } from 'react';

interface UseSidebarReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Sidebar 상태 관리 커스텀 훅
 * - 사이드바 열림/닫힘 상태를 관리합니다.
 * - 사이드바가 열렸을 때 배경 스크롤을 방지합니다.
 */
export function useSidebar(): UseSidebarReturn {
  const [isOpen, setIsOpen] = useState(false);

  // Sidebar 열기
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Sidebar 닫기
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Sidebar 토글
  const toggle = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  // Sidebar 열림/닫힘에 따라 body 스크롤 제어
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // 클린업 함수: 언마운트 시 스타일 초기화
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
