import {createContext, useContext, useState} from "react";
import type { ReactNode } from "react";

interface CounterContextType {
  count: number;
  handleIncrement: () => void;
  handleDecrement: () => void;
}

export const CounterContext = createContext<CounterContextType | undefined>(
  undefined
);

export const CounterProvider = ({children}: {children: ReactNode}) => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount((prev) => prev + 1);
  const handleDecrement = () => setCount((prev) => prev - 1);

  return (
    <CounterContext.Provider
      value={{count, handleIncrement, handleDecrement}}
    >
      {children}
    </CounterContext.Provider>
  );
};

export const useCounter = () => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error(
      'useCount는 반드시 CountProvider 내부에서 사용되어야 합니다.'
    );
  }
  return context;
}