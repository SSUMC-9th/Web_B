import clsx from 'clsx';
import { THEME, useTheme } from './context/ThemeProvider';
import { type ReactElement } from 'react';

export default function ThemeContent(): ReactElement {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <div
      className={clsx(
        'p-4 h-dvh w-full',
        isLightMode ? 'bg-white' : 'bg-gray-800'
      )}
    >
      <h1
        className={clsx(
          'text-2xl font-bold',
          isLightMode ? 'text-black' : 'text-white'
        )}
      >
        Theme Content
      </h1>

      <p
        className={clsx(
          'mt-2',
          isLightMode ? 'text-black' : 'text-white'
        )}
      >
        From the moment we are born, 
        we are trapped inside these walls. 
        Everyone tells us to be content with this cage, to live quietly and accept our fate. 
        But I can’t. I refuse to spend my life like cattle waiting for the slaughter. 
        If freedom exists beyond these walls, I will find it. Even if I have to fight the whole world, 
        even if I become hated, even if I have to sacrifice everything—I will keep moving forward, 
        because that is the only way I know how to live.
      </p>
    </div>
  );
}
