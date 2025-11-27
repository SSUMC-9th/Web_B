import type { ColItems } from "../types/col";
import { colitems } from "../constants/colitems.ts";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand/react";
import {useShallow} from "zustand/react/shallow";

interface Actions {
  increaseItem: (id: string) => void;
  decreaseItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCol: () => void;
  calculateTotals: () => void;
}

interface ColState {
  items: ColItems;
  amount: number;
  price: number;

  actions: Actions;
}

// totals 계산 헬퍼 함수
const calculateTotalsHelper = (items: ColItems) => {
  let totalAmount = 0;
  let totalPrice = 0;

  items.forEach((item) => {
    totalAmount += item.amount;
    totalPrice += item.amount * item.price;
  });

  return {
    amount: totalAmount,
    price: parseFloat(totalPrice.toFixed(2)),
  };
};

// 초기 totals 계산
const initialTotals = calculateTotalsHelper(colitems);

// state를 받아서 totals를 업데이트하는 헬퍼 함수
const updateTotals = (state: ColState) => {
  const totals = calculateTotalsHelper(state.items);
  state.amount = totals.amount;
  state.price = totals.price;
};

export const useColStore = create<ColState>()(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  immer((set, _) => ({
    items: colitems,
    amount: initialTotals.amount,
    price: initialTotals.price,

    actions: {
      increaseItem: (id: string) => {
        set((state) => {
          const item = state.items.find((item) => item.id === id);
          if (item) {
            item.amount += 1;
          }
          updateTotals(state);
        });
      },
      decreaseItem: (id: string) => {
        set((state) => {
          const item = state.items.find((item) => item.id === id);
          if (item) {
            item.amount -= 1;
          }
          updateTotals(state);
        });
      },
      removeItem: (id: string) => {
        set((state) => {
          state.items = state.items.filter((item) => item.id !== id);
          updateTotals(state);
        });
      },
      clearCol: () => {
        set((state) => {
          state.items = [];
          state.amount = 0;
          state.price = 0;
        });
      },
      calculateTotals: () => {
        set((state) => {
          updateTotals(state);
        });
      },
    },
  }))
);

export const useColInfo = () =>
  useColStore(
    useShallow((state) => ({
      items: state.items,
      amount: state.amount,
      price: state.price,
    }))
  );

export const useColActions = () => useColStore(
  (col) => col.actions
);