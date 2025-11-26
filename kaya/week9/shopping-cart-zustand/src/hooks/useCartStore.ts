import {type CartItems} from '../types/cart';
import cartItems from '../constants/cartItems';
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import { useShallow } from 'zustand/shallow';

interface CartActions {
    increase: (id: string) => void;
    decrease: (id: string) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    calculateTotals: () => void;
}

interface CartState {
    cartItems: CartItems;
    amount: number;
    total: number;
    
    actions: CartActions;
}

export const useCartStore = create<CartState>()(
    /* eslint-disable @typescript-esline/no-unused-vars */
    immer((set, _) => ({
    cartItems: cartItems,
    amount: 0,
    total: 0,
    actions: {
        increase: (id: string): void => {
            set((state) => {
                const cartItem = state.cartItems.find((item) => item.id === id);

                if (cartItem) {
                    cartItem.amount += 1;
                }
            })
        },
        decrease: (id: string): void => {
            set((state) => {
                const cartItem = state.cartItems.find((item) => item.id === id);

                if (cartItem && cartItem.amount > 0) {
                    cartItem.amount -= 1;
                }
            })
        },
        removeItem: (id: string): void => {
            set((state) => {
                state.cartItems = state.cartItems.filter((item) => item.id !== id);
            })
        },
        clearCart: (): void => {
            set((state) => {
                state.cartItems = [];
            })
        },
        calculateTotals: (): void => {
            set((state) => {
                let amount = 0;
                let total = 0;

                state.cartItems.forEach((item) => {
                    amount += item.amount;
                    total += item.amount * item.price;
                });

                state.amount = amount;
                state.total = total;
            })
        },
    },
})));


// 단일 구독?
export const useCartInfo = () => 
    useCartStore(
        useShallow((state) => ({
            cartItems: state.cartItems,
            amount: state.amount,
            total: state.total,
        }))
    )

export const useCartActions = () => useCartStore((state) => state.actions);