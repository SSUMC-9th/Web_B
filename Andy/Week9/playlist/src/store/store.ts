import { configureStore } from '@reduxjs/toolkit';
import cartReducer from "../features/col/colSlice.ts";
import modalReducer from "../features/modal/modalSlice.ts";

// 1. 저장소를 생성함
function createStore() {
  const store = configureStore({
    // 2. 리듀서를 결합함
    reducer: {
      cart: cartReducer,
      modal: modalReducer,
    },
  })

  return store;
}

// store를 내보냄
// 여기서 실행해서 store를 만듦 (싱글톤 패턴)
const store = createStore();

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;