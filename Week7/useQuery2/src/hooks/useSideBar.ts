// src/hooks/useSidebar.js (또는 .tsx)

import { useState, useCallback } from 'react';

// initialState의 기본값은 true (기본적으로 열린 상태)로 설정
const useSidebar = (initialState = true) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialState);

  // useCallback을 사용하여 함수가 렌더링될 때마다 재생성되는 것을 방지
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []); // 의존성 배열이 비어있으므로 컴포넌트 마운트 시 한 번만 생성

  return { isSidebarOpen, toggleSidebar };
};

export default useSidebar;