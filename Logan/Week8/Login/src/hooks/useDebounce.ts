import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    //delay(ms) 후에 실행합니다.
    // deflay 시간 후에 value를 debouncedValue로 업데이트 하는 타이머 실시
    const handler: number = setTimeout(() => setDebouncedValue(value), delay);

    // value가 변경되면, 기존타이머를 지워서 업데이트 취소함
    // 값이 계속 바뀔때마다 마지막에 멈춘 값만 업데이트됨
    return () => clearTimeout(handler);
  }, [value, delay]);

  // 우리가 설정한 delay이후에 입력이 없으면 최종적으로 value를 업데이트하는 훅이다.
  return debouncedValue;
}

export default useDebounce;
