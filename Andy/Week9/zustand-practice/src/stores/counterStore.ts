import { create } from 'zustand';
import type { CounterState, Actions } from "../types/CounterState.ts";
import { devtools } from 'zustand/middleware';

export const useCounterStore = create<CounterState>()(
  devtools((set) => ({
    count: 0,
    randomNumber: 0,

    actions: {
      increment: () =>
        set((state) => ({
          count: state.count + 1,
        }), undefined, 'increment'),
      decrement: () =>
        set((state) => ({
          count: state.count - 1,
        }), undefined, 'decrement'),
      random: () =>
        set(() => ({
          randomNumber: Math.floor(Math.random() * 100),
        }), undefined, 'random'),
    } as Actions, // TypeScript가 객체 리터럴을 CounterState 타입과 매칭하려 해서 에러 발생.
    name: 'counter-store',
  }))
);