// components/Route.tsx
import type { RouteProps } from '../types/RouteProps';

export const Route = ({ component: Component }: RouteProps) => {
  return <Component />;
};
