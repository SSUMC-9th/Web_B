import type { AppDispatch, RootState } from "../store/store.ts";
import {
  type TypedUseSelectorHook,
  useDispatch as useDefaultDispatch,
  useSelector as useDefaultSelector
} from "react-redux";


export const useAppDispatch: () => AppDispatch = useDefaultDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useDefaultSelector;

