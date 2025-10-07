import { createContext, useContext, useState, type ReactNode } from 'react';

// Context의 타입 정의
interface CounterContextType {
  count: number;
  increase: () => void;
  decrease: () => void;
}

// Context 생성 (초기값은 undefined로 설정)
export const CounterContext = createContext<CounterContextType | undefined>(
  undefined
);

// Context Provider 생성
export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0);

  const increase = () => setCount((이전) => 이전 < 12 ? 이전 + 1 : 12);
  const decrease = () => setCount((prev) => prev > 0 ? prev - 1 : 0 );

  return (
    <CounterContext.Provider
      value={{ count, increase, decrease}}
    >
      {children}
    </CounterContext.Provider>
  );
};

// CounterProvider.tsx 맨 아래 추가
export const useCount = () => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error(
      'useCount는 반드시 CountProvider 내부에서 사용되어야 합니다.'
    );
  }
  return context;
};