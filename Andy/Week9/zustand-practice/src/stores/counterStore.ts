import { create } from 'zustand';
import type { CounterState } from "../types/CounterState.ts";
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
    },
    name: 'counter-store',
  }))
);