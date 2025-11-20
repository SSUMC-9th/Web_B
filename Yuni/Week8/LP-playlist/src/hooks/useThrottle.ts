import { useEffect, useRef } from 'react';

//useThrottle: 콜백 함수를 일정 시간 간격으로만 실행하는 커스텀 훅

function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  interval: number
): (...args: Parameters<T>) => void {
  // 마지막 실행 시간을 추적하는 ref
  const lastRunRef = useRef<number>(0);

  // 대기 중인 타이머 ID를 저장하는 ref
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 타이머와 플래그를 정리하는 함수
  const cleanup = () => {
    if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = null;
    }
  };

  // 컴포넌트 언마운트 또는 의존성 변경 시 정리
  useEffect(() => {
    return cleanup;
  }, [callback, interval]);

  // throttle된 함수 반환
  const throttledFunction = (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRunRef.current;

    // 마지막 실행 이후 interval 시간이 지났으면 즉시 실행
    if (timeSinceLastRun >= interval) {
      lastRunRef.current = now;
      cleanup(); // 예약된 타이머가 있으면 취소
      callback(...args);
    } else if (!timerId.current) {
      // interval 시간이 지나지 않았고, 예약된 콜이 없으면 새로 예약
      timerId.current = setTimeout(() => {
        lastRunRef.current = Date.now();
        cleanup();
        callback(...args);
      }, interval - timeSinceLastRun);
    }
  };

  return throttledFunction;
}

export default useThrottle;
