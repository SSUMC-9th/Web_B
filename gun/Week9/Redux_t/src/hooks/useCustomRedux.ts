import { useDispatch as useDefulatDispatch, useSelector as useDefulatSelector, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";

export const useDispatch: () => AppDispatch = useDefulatDispatch;

export const useSelector: TypedUseSelectorHook<RootState> = useDefulatSelector;