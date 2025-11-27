import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  title: string;
  artist: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    title: 'Vancouver',
    artist: 'BiG Naughty (서동현)',
    price: 25000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'
  },
  {
    id: 2,
    title: 'Empty Island',
    artist: 'greenblue',
    price: 18000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop'
  },
  {
    id: 3,
    title: 'golden hour',
    artist: 'JVKE',
    price: 28000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=200&h=200&fit=crop'
  },
  {
    id: 4,
    title: 'Home Sweet Home(From "어쩌면 우린 해어졌는지 모른다")',
    artist: 'Gogang (고갱)',
    price: 20000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop'
  },
  {
    id: 5,
    title: 'Lemon',
    artist: 'Kenshi Yonezu(겐시 요네즈/米津 玄師)',
    price: 30000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=200&h=200&fit=crop'
  },
  {
    id: 6,
    title: '들맹이',
    artist: 'MASYTA (마시따)',
    price: 12000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop'
  },
  {
    id: 7,
    title: "L'Amour, Les Baguettes, Paris",
    artist: '스텔라 장(Stella Jang)',
    price: 32000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=200&h=200&fit=crop'
  },
  {
    id: 8,
    title: 'NO PAIN',
    artist: '실리카겔',
    price: 22000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop'
  }
];

const calculateTotals = (items: CartItem[]) => {
  const amount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { amount, total };
};

const initialState: CartState = {
  cartItems: initialCartItems,
  ...calculateTotals(initialCartItems),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<number>) => {
      const item = state.cartItems.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        const { amount, total } = calculateTotals(state.cartItems);
        state.amount = amount;
        state.total = total;
      }
    },
    decrease: (state, action: PayloadAction<number>) => {
      const item = state.cartItems.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
        }
        const { amount, total } = calculateTotals(state.cartItems);
        state.amount = amount;
        state.total = total;
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
      const { amount, total } = calculateTotals(state.cartItems);
      state.amount = amount;
      state.total = total;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    calculateTotals: (state) => {
      const { amount, total } = calculateTotals(state.cartItems);
      state.amount = amount;
      state.total = total;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals: calculateTotalsAction } = cartSlice.actions;
export default cartSlice.reducer;
