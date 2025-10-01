import {createContext, useContext, useState} from 'react';
import type { ReactNode } from 'react'; //타입 전용으로 불러오기

//Context의 타입 정의
interface CounterContextType {
  count : number;
  handleIncrement: () => void;
  handleDecrement: () => void;
}

//Context 생성 - createContext, 저장소 역할 (초기값 undefined)
export const CounterContext = createContext<CounterContextType | undefined> (
  undefined
);

//Context Provider 생성 - .Provider, value, 공급 역할
export const CounterProvider = ({children} : {children:ReactNode}) => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount((prev) => prev + 1);
  const handleDecrement = () => setCount((prev) => prev -1);

  return (
    <CounterContext.Provider
      value = {{count, handleIncrement, handleDecrement}}
    >
      {children}
    </CounterContext.Provider>
  );
};

//커스텀 훅으로 만들기
export const useCount = () => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error(
        'useCount는 반드시 CountProvider 내부에서 사용되어야 합니다.'
    );
  }
  return context;
}