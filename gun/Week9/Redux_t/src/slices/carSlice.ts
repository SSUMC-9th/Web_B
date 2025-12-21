import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cartItems from "../constants/cartitem";
import type { CartItems } from "../types/cart";

export interface CartState {
    cartItems: CartItems;
    amount: number;
    total: number;
}

const initialState: CartState = {
    cartItems: cartItems,
    amount: 0,
    total: 0,
};

// cartSlice 생성
// createSlice -> reduxToolkit에서 제공

const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers: {
        // 1. 장바구니 전체 비우기
        clearCart: (state) => {
            state.cartItems = []; // Immer 덕분에 직접 할당이 가능합니다!
        },

        // 2. 특정 아이템 제거 (id를 payload로 받음)
        removeItem: (state, action: PayloadAction<string>) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
        },

        // 3. 수량 증가
        increase: (state, action: PayloadAction<string>) => {
            const cartItem = state.cartItems.find((item) => item.id === action.payload);
            if (cartItem) {
                cartItem.amount = cartItem.amount + 1;
            }
        },

        // 4. 수량 감소
        decrease: (state, action: PayloadAction<string>) => {
            const cartItem = state.cartItems.find((item) => item.id === action.payload);
            if (cartItem) {
                cartItem.amount = cartItem.amount - 1;
            }
        },

        // 5. 총액 및 총 수량 계산
        calculateTotals: (state) => {
            let amount = 0;
            let total = 0;
            
            state.cartItems.forEach((item) => {
                amount += item.amount;
                // price가 string이라면 parseFloat나 Number로 변환이 필요할 수 있습니다.
                total += item.amount * Number(item.price);
            });

            state.amount = amount;
            state.total = total;
        },
    },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } = cartSlice.actions;
// duck pattern : reducer는 eport default로 내보냄.
const cartReducer = cartSlice.reducer;

export default cartReducer;