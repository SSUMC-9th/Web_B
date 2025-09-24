import { type PropsWithChildren, useState } from "react";
import { ThemeContext, THEME, type TTheme } from "./ThemeContext";

export const ThemeProvider = ({children, className}: PropsWithChildren & {className?: string}) => {
  const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
    );
  }

  return (
    <div className={className} style={{
      backgroundColor: theme === THEME.DARK ? '#1a1a1a' : '#ffffff',
      color: theme === THEME.DARK ? '#ffffff' : '#000000',
      minHeight: '100vh'
    }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </div>
  )
}

