// 아래 스크롤 네트워크 요청이 가지 않음

import { useRef, useCallback } from "react";

// fn: 아무 인자나 받아서 아무 것도 안 돌려줘도 되는 함수
export default function useThrottleFn(
  fn: (...args: any[]) => void,
  delay: number = 1000
) {
  const lastExec = useRef(0);

  return useCallback(
    (...args: any[]) => {
      const now = Date.now();
      if (now - lastExec.current >= delay) {
        lastExec.current = now;
        fn(...args);
      }
    },
    [fn, delay]
  );
}
