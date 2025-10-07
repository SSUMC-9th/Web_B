import React from "react";

interface RouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export const Route: React.FC<RouteProps> = ({ component: Component }) => {
  return <Component />;
};

Route.displayName = "Route";