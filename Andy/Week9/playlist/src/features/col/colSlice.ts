import type { ColItems } from "../../types/col.ts";
import { colitems } from "../../constants/colitems.ts";
import { createSlice } from "@reduxjs/toolkit";

export interface ColState {
  items: ColItems;
  amount: number;
  price: number;
}

const initialState: ColState = {
  items: colitems,
  amount: 0,
  price: 0,
}

const calculateTotalsHelper = (state: ColState) => {
  let totalAmount = 0;
  let totalPrice = 0;

  state.items.forEach(item => {
    totalAmount += item.amount;
    totalPrice += item.amount * item.price;
  });

  state.amount = totalAmount;
  state.price = parseFloat(totalPrice.toFixed(2));
}

const colSlice = createSlice({
  name: 'col',
  initialState,
  reducers: {
    increaseItem(state, action) {
      const itemId = action.payload;
      const item = state.items.find(item => item.id === itemId);
      if (item) {
        item.amount += 1;
        calculateTotalsHelper(state);
      }
    },
    decreaseItem(state, action) {
      const itemId = action.payload;
      const item = state.items.find(item => item.id === itemId);
      if (item) {
        item.amount -= 1;
        calculateTotalsHelper(state);
      }
    },
    removeItem(state, action) {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      // calculateTotalsHelper(state);
    },
    clearCol(state) {
      state.items = [];
      state.amount = 0;
      state.price = 0;
    },
    calculateTotals(state) {
      calculateTotalsHelper(state);
    }
  }
});

export const { increaseItem, decreaseItem, removeItem, clearCol, calculateTotals } = colSlice.actions;

const colReducer = colSlice.reducer;

export default colReducer;
