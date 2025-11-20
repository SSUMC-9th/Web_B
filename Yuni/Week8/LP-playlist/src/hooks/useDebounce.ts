import { useState, useEffect } from 'react';

//값 지연형 useDebounce 커스텀 훅
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 시간 후에 상태 업데이트
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 정리 함수: 이전 타이머 취소
    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
