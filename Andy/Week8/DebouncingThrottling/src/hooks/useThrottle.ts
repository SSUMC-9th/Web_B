import {useEffect, useRef, useState} from "react";

function useThrottle<T>(value: T, delay = 500): T {
  // 1. 상태 변수: throttledValue: 최종적으로 쓰로틀링 적용될 값
  // 초기에 전달받은 값
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // 2. ref 변수: lastExecuted: 마지막으로 값이 업데이트된 시간 기록
  const lastExecuted = useRef<number>(Date.now());

  // 3. useEffect: value, delay가 바뀔 때마다 실행
  useEffect(() => {
    // 현재 시각과 lastExecuted.current에 저장된 마지막 시간 + interval을 비교
    // 충분한 시간이 지나면 바로 업데이트
    if (Date.now() >= lastExecuted.current + delay) {
      // 마지막 실행 시간 갱신
      lastExecuted.current = Date.now();
      // 값 갱신
      setThrottledValue(value);
    } else {
      // 충분한 시간이 지나지 않았으면 delay 이후에 업데이트 예약
      const timerId = setTimeout(() => {
        // 마지막 실행 시간 갱신
        lastExecuted.current = Date.now();
        // 값 갱신
        setThrottledValue(value);
      }, delay);

      // cleanup 함수: Function 이펙트가 재실행되기 전에 타이머가 실행되지 않았다면
      // 기존 타이머를 clearTimeout을 통해 취소하여 중복 실행 방지
      return () => clearTimeout(timerId);
    }
  }, [value, delay]);

  // 4. 최종적으로 쓰로틀링이 적용된 값 반환
  return throttledValue;
}

export default useThrottle;