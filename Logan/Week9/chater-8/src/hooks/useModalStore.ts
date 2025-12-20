// src/hooks/useModalStore.ts
// gpt가 만든... ㅅ용안함
import { create } from "zustand";

interface ModalStoreState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStoreState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
