import React, { Children, cloneElement, isValidElement } from "react";
import type {ReactElement, ReactNode} from "react";
import { useCurrentPath } from "./hooks";

interface RoutesProps {
  children: ReactNode;
}

export const Routes: React.FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();

  const routes = Children.toArray(children).filter(
    child => isValidElement(child) && (child.type as any).displayName === "Route"
  ) as ReactElement<{ path: string }>[];

  const active = routes.find(route => route.props.path === currentPath);

  if (!active) {
    return <h1>404 Not Found</h1>;
  }

  return cloneElement(active);
};