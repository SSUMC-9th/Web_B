//useThrottle : 주어진 값이 자주 변경될 떄
//최소 interval(밀리초) 간격으로만 업데이트한다

import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value:T, delay:number = 500):T {
  // 1. 상태 변수: throttledValue : 최종적으로 쓰로틀링 적용된 값 저장
  // 초기 값을 전달 받음
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // 2. Ref lastExcuted : 마지막으로 실행된 시간을 기록하는 변수
  //useRef 사용하면 컴포넌트가 리렌더링 되어도 값이 유지, 변경되도 리렌더링 X
  const lastExcuted = useRef<number>(Date.now());

  //3. useEffect : value, delay가 변경될 떄 실행
    useEffect( ()=> {
        //현재시각과 lastExcuted.current에 저장된 마지막 시각 + delay 비교
        //충분한 시간이 지나면 업데이트
        if (Date.now() >= lastExcuted.current + delay)  {
            //현재 시간이 지난경우, 
            //현재 시각으로 lastExcuted 업데이트
            lastExcuted.current = Date.now();
            //최신 value를 throttledValue에 저장해서 컴포넌트 리렌더링
            setThrottledValue(value);
        }
        else{
            const timeId = setTimeout( () => {
                //타이머가 만료되면 , 마지막 업데이트 시간을 현재 시각으로 갱신
            lastExcuted.current = Date.now();
            //최신 value를 throttledValue에 저장해서 컴포넌트 리렌더링
            setThrottledValue(value);
            }, delay);

            //ClearUpFunction 이펙트가 재실행되기전에 타이머가 실행되지 않으면
            //기존타이머를 clearTimeout을 통해 취소하여 중복 업데이트를 방지
            return() => clearTimeout(timeId);
        }
    }, [value, delay]);

    return throttledValue;
}

export default useThrottle; 