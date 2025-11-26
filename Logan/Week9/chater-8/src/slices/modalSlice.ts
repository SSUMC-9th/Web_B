import { createSlice } from "@reduxjs/toolkit";

// 모달 전역 상태 타입
export interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};

// modalSlice 생성
const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    // 모달 열기
    openModal: (state): void => {
      state.isOpen = true;
    },
    // 모달 닫기
    closeModal: (state): void => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

const modalReducer = modalSlice.reducer;

export default modalReducer;
