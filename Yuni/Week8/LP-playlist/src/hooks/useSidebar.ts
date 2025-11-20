import { useState, useCallback } from 'react';

interface UseSidebarReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Sidebar 상태 관리 커스텀 훅
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

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
