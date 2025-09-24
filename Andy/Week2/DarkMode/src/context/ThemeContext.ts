import { createContext } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum THEME {
  LIGHT = 'LIGHT',
  DARK = 'DARK'
}

export type TTheme = THEME.LIGHT | THEME.DARK;

export interface IThemeContext {
  theme: THEME.LIGHT | THEME.DARK;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);