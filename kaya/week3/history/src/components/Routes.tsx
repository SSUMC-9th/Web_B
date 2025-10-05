// components/Routes.tsx
import {
  Children,
  isValidElement,
  useMemo,
} from 'react';
import type { ReactElement, ReactNode } from 'react';
import { useCurrentPath } from '../hooks/useCurrentPath';
import type { RouteProps } from '../types/RouteProps';

// element가 <Route .../> 형태이고 RouteProps를 가진다는 것을 보장
function isRouteElement(el: ReactNode): el is ReactElement<RouteProps> {
  return isValidElement(el) && typeof (el as any).props?.path === 'string';
}

interface RoutesProps {
  children: ReactNode;
}

export const Routes = ({ children }: RoutesProps) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo<ReactElement<RouteProps> | null>(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return (routes as ReactElement<RouteProps>[]).find(
      (route) => route.props.path === currentPath
    ) ?? null;
  }, [children, currentPath]);

  // 굳이 cloneElement 할 필요 없음: <Route .../> 자체가 렌더 컴포넌트니까 그대로 반환
  return activeRoute ?? null;
};
