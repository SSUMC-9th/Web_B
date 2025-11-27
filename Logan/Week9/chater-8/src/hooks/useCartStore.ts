import { create } from "zustand";
import type { CartItems } from "../types/cart";
import { immer } from "zustand/middleware/immer";
import cartItems from "../constants/cartItems";
import { calculateTotals, decrease, removeItem } from "../slices/cartSlice";
import { useShallow } from "zustand/react/shallow";

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

export const userCartStore = create<CartState>()(
  /* eslint-disable @typescript-eslint/no-unused-vars */
  immer((set, _) => ({
    cartItems: cartItems,
    amount: 0,
    total: 0,
    actions: {
      increase: (id: string): void => {
        set((state): void => {
          const cartItem = state.cartItems.find(
            (item): boolean => item.id === id
          );

          if (cartItem) {
            cartItem.amount += 1;
          }
        });
      },

      decrease: (id: string): void => {
        set((state): void => {
          const cartItem = state.cartItems.find(
            (item): boolean => item.id === id
          );

          if (cartItem && cartItem.amount > 0) {
            cartItem.amount -= 1;
          }
        });
      },

      removeItem: (id: string): void => {
        set((state): void => {
          state.cartItems = state.cartItems.filter(
            (item): boolean => item.id !== id
          );
        });
      },

      clearCart: (): void => {
        set((state): void => {
          state.cartItems = [];
        });
      },
      calculateTotals: (): void => {
        set((state): void => {
          let amount = 0;
          let total = 0;

          state.cartItems.forEach((item): void => {
            amount += item.amount;
            total += item.amount * item.price;
          });

          state.amount = amount;
          state.total = total;
        });
      },
    },
  }))
);

export const useCartInfo = () =>
  userCartStore(
    useShallow((state) => ({
      cartItems: state.cartItems,
      amount: state.amount,
      total: state.total,
    }))
  );

export const useCartActions = () =>
  userCartStore((state): CartActions => state.actions);

// // zustand
// // src/hooks/useCartStore.ts
// // src/hooks/useCartStore.ts
// import { create } from "zustand";
// import cartItemsData from "../constants/cartItems";
// import type { CartItems } from "../types/cart";

// // 스토어 상태 타입
// interface CartStoreState {
//   cartItems: CartItems;
//   amount: number;
//   total: number;

//   // Redux와 최대한 비슷한 시그니처 유지
//   increase: (payload: { id: string }) => void;
//   decrease: (payload: { id: string }) => void;
//   removeItem: (payload: { id: string }) => void;
//   clearCart: () => void;
//   calculateTotals: () => void;
// }

// // 합계 계산 유틸 함수
// const calcTotals = (cartItems: CartItems) => {
//   let amount = 0;
//   let total = 0;

//   cartItems.forEach((item) => {
//     amount += item.amount;
//     total += item.amount * item.price;
//   });

//   return { amount, total };
// };

// // 초기값 세팅 (아이템 배열 기반으로 최초 합계 계산)
// const initialCartItems: CartItems = cartItemsData;
// const initialTotals = calcTotals(initialCartItems);

// // Zustand 스토어 생성
// export const useCartStore = create<CartStoreState>((set, get) => ({
//   cartItems: initialCartItems,
//   amount: initialTotals.amount,
//   total: initialTotals.total,

//   // 수량 증가
//   increase: ({ id }) =>
//     set((state) => {
//       const cartItems = state.cartItems.map((item) =>
//         item.id === id ? { ...item, amount: item.amount + 1 } : item
//       );
//       const { amount, total } = calcTotals(cartItems);
//       return { cartItems, amount, total };
//     }),

//   // 수량 감소 (0까지 내려갈 수 있게 – 실제 삭제는 컴포넌트에서 처리)
//   decrease: ({ id }) =>
//     set((state) => {
//       const cartItems = state.cartItems.map((item) =>
//         item.id === id ? { ...item, amount: item.amount - 1 } : item
//       );
//       const { amount, total } = calcTotals(cartItems);
//       return { cartItems, amount, total };
//     }),

//   // 아이템 삭제
//   removeItem: ({ id }) =>
//     set((state) => {
//       const cartItems = state.cartItems.filter((item) => item.id !== id);
//       const { amount, total } = calcTotals(cartItems);
//       return { cartItems, amount, total };
//     }),

//   // 장바구니 비우기
//   clearCart: () =>
//     set(() => {
//       const cartItems: CartItems = [];
//       const { amount, total } = calcTotals(cartItems);
//       return { cartItems, amount, total };
//     }),

//   // 합계를 다시 계산하는 액션 (필요하면 쓸 수 있도록 남겨둠)
//   calculateTotals: () => {
//     const { cartItems } = get();
//     const { amount, total } = calcTotals(cartItems);
//     set({ amount, total });
//   },
// }));

// // 상태만 보고 싶을 때
// export const useCartInfo = () =>
//   useCartStore((state) => ({
//     cartItems: state.cartItems,
//     amount: state.amount,
//     total: state.total,
//   }));

// // 액션만 쓰고 싶을 때
// export const useCartActions = () =>
//   useCartStore((state) => ({
//     increase: state.increase,
//     decrease: state.decrease,
//     removeItem: state.removeItem,
//     clearCart: state.clearCart,
//     calculateTotals: state.calculateTotals,
//   }));
