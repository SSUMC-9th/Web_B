// components/Link.tsx
import type { MouseEvent } from 'react';
import type { LinkProps } from '../types/LinkProps';
import { getCurrentPath, navigateTo } from '../utils/utils';

export const Link = ({ to, children }: LinkProps) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (getCurrentPath() === to) return; // 이미 같은 경로면 무시
    navigateTo(to);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};
