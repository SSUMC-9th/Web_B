import {
  Children,
  cloneElement,
  isValidElement,
  useMemo,
  type FC,
  type MouseEvent,
} from 'react';
import type { LinkProps, RouteProps, RoutesProps } from './types';
import { getCurrentPath, navigateTo } from './utils';
import { useCurrentPath } from './useCurrentPath';

// ---------- Link ----------
export const Link: FC<LinkProps> = ({ to, children }) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // 기본 a태그 동작(페이지 전체 리로드)을 막는다
    e.preventDefault();
    if (getCurrentPath() === to) return;
    navigateTo(to);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};

// ---------- Route ----------
/**
 * Route는 선언만 담당.
 * 실제 렌더링은 <Routes>가 현재 경로와 매칭되는 Route를 찾아서 clone하여 수행한다.
 */
export const Route: FC<RouteProps> = () => null;

// ---------- Routes ----------
const isRouteElement = (el: any): el is React.ReactElement<RouteProps> =>
  isValidElement(el) && typeof el.props?.path === 'string' && !!el.props?.component;

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement) as React.ReactElement<RouteProps>[];

    // 1) 정확히 일치하는 경로 우선
    const exact = routes.find((r) => r.props.path === currentPath);
    if (exact) return exact;

    // 2) 와일드카드('*')를 404 용도로 지원
    const wildcard = routes.find((r) => r.props.path === '*');
    return wildcard ?? null;
  }, [children, currentPath]);

  if (!activeRoute) return null;

  const Component = activeRoute.props.component;
  // Route 자체는 렌더링하지 않고, 해당 컴포넌트를 렌더링
  return cloneElement(<Component />);
};

export type { LinkProps, RouteProps, RoutesProps };
