import { useState, useEffect } from "react";

/**
 * useDebounce 커스텀 훅
 *
 * @description
 * 입력값을 지연시켜 반환하는 훅입니다.
 * 빠른 입력 변경 시 마지막 값만 delay 후에 반영됩니다.
 *
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (ms)
 * @returns 지연된 값
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 후에 값을 업데이트하는 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 언마운트 시 또는 value, delay 변경 시 타이머 정리
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
