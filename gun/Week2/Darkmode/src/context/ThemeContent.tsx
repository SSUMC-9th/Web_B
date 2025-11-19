import clsx from "clsx";
import { THEME, useTheme } from "./ThemeProvider"

export default function ThemeContent() {
  const {theme} = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <div className={clsx(
      'p-4 h-dvh w-full',
      isLightMode ? 'bg-white' : 'bg-gray-800'
    )}>
      <h1
        className={clsx(
            'text-wxl font-bold',
            isLightMode ? 'text-black' : 'text-white'
        )}>
          Theme Content
        </h1>
        <p className={clsx(
            'mt-2',
            isLightMode ? 'text-black' : 'text-white')}>
          Make sure your compiled CSS is included in the
             (your framework might handle this for you), 
            then start using Tailwind’s utility classes to style your content.
        </p>
    </div>
  )
}
