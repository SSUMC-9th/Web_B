import type { CartItems } from "../../types/cart.ts";
import { cartItems } from "../../constants/cartitems.ts";
import { createSlice } from "@reduxjs/toolkit";

export interface CartState {
  items: CartItems;
  amount: number;
  price: number;
}

const initialState: CartState = {
  items: cartItems,
  amount: 0,
  price: 0,
}

const calculateTotalsHelper = (state: CartState) => {
  let totalAmount = 0;
  let totalPrice = 0;

  state.items.forEach(item => {
    totalAmount += item.amount;
    totalPrice += item.amount * item.price;
  });

  state.amount = totalAmount;
  state.price = parseFloat(totalPrice.toFixed(2));
}

const cartSlice = createSlice({
  name: 'cart',
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
      calculateTotalsHelper(state);
    },
    clearCart(state) {
      state.items = [];
      state.amount = 0;
      state.price = 0;
    },
    calculateTotals(state) {
      calculateTotalsHelper(state);
    }
  }
});

export const { increaseItem, decreaseItem, removeItem, clearCart, calculateTotals } = cartSlice.actions;

const cartReducer = cartSlice.reducer;

export default cartReducer;
