import { useEffect, useRef, useState } from "react";

// useThrottle : 주어진 값 (상태)가 자주 변경될때
// 최소 interval 간격으로만 업데이트해서 성능을 개선한다.
function useThrottle<T>(value: T, delay: number = 500): T {
  //1. 상태 변수 : throttledValue: 최종적으로 쓰로틀링 적용된 값 저장
  // 초기값을 전달받은 value

  const [throttledValue, setThrottledValue] = useState<T>(value);

  // 2. Ref lastExectuted: 마지막으로 실행된 시간을 기록하는 변수
  // useRef 사용하면 컴포넌트가 리렌더링 되어도 값이 유지되고, 변경되어도 리렌더링을 트리거하지 않는다.
  const lastExectuted = useRef<number>(Date.now());

  // 3. useEffect: value, delay가 변경될때 아래로직 실행

  useEffect(() => {
    // 현재 시각과 lastExectued.current에 저장된 마지막 시각+ delay를 비교합니다.
    // 충분한 시간이 지나면 바로 업데이트
    if (Date.now() >= lastExectuted.current + delay) {
      // 현재 시간이 지난 경우,
      // 현재 시각으로 lastExectued 업데이트
      lastExectuted.current = Date.now();

      // 최신 value를 throttledvalue에 저장해서 컴포넌트 리렌더링
      setThrottledValue(value);
    } else {
      // 충분한 시간이 지나지 않은 경우, delay 시간 후에 업데이트( 최신 value로 )
      const timerId = setTimeout(() => {
        lastExectuted.current = Date.now();
        // 최신 value를 throtteldValue에 저장해서 컴포넌트 리렌더링
        setThrottledValue(value);
      }, delay);

      return () => clearTimeout(timerId);
    }
  }, [value, delay]);

  return throttledValue;
}

export default useThrottle;
