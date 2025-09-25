import React from 'react'
import clsx from 'clsx';
import { THEME, useTheme } from './context/ThemeProvider'

export default function ThemeToggleButton() {

    const {theme, toggleTheme}=useTheme();

    const isLightMode=theme ===THEME.LIGHT;

    //const {toggleTheme}=useTheme();

    return (
    <button onClick={toggleTheme}
    
        className={clsx('px-4 py-2 mt-4 rounded-md transition-all', {
            'bg-black text-white': !isLightMode,
            'bg-white text-black': isLightMode,
        })}
        >
        {isLightMode?  '다크모드로 전환': '라이트 모드로 전환'}
    </button>
  );
}
