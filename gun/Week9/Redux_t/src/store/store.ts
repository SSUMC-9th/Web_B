import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../slices/carSlice';
import modalReducer from '../slices/modalSlice'; // 1. 제작한 modalSlice 가져오기

// 1. 저장소 생성
function createStore() {
  const store = configureStore({
    // 2. 리듀서 설정
    reducer: {
        cart: cartReducer,
        modal: modalReducer, // 2. 여기에 모달 리듀서 등록!
    },
  });

  return store;
}

const store = createStore();

export default store;

// 3. 타입 내보내기 (이 부분은 수정할 필요 없습니다)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch