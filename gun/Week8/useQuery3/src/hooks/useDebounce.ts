import { useEffect, useState } from "react";

export default function useDebounce<T>(value:T, delay:number) {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    // value, delay가 변경될 때 마다 실행 
    useEffect(()=> {
        
        // delay 이후에 실행함.
        // delay 시간 후에 value를 debounceValue로 업데이트하는 타이머 시작
        //setTimeout(함수, 시간)
        // ()=>함수 는 콜백함수
        const handler = setTimeout(()=>setDebouncedValue(value), delay) 

        // value가 변경되면, 기존 타이머를 지워서 업데이트를 취소합니다.
            //값이 바뀔때마다 마지막에 멈춘 값만 업데이트 된다. 
        return () => clearTimeout(handler);

    },[value, delay]);
    // delay가 고정되면 뺴도된다. 그러나 사용자 경험 최적화를 위해서는 넣는데 맞음
    // ex) delay = isMobile ? 800 : 400;

    //최종적으로 잠시 기다린 후의 값을 반환
    return debouncedValue;
}

