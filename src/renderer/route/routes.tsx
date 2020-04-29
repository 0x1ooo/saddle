import React, { ComponentClass, FunctionComponent } from 'react';
import { Route } from 'react-router-dom';
import * as test from './test-comps';

interface RouteConfig {
  path: string;
  component: FunctionComponent | ComponentClass;
  routes?: RouteConfig[];
}

/** Routes of the root level.
 * They are used as the first page on window shown.
 */
export const rootRoutes: RouteConfig[] = [
  { path: '/about', component: test.About },
  { path: '/test', component: test.Test },
  { path: '/', component: test.Home },
];

/** A wrapper component that applies a `RouteConfig` to `Route` node. */
export function PageRoute(route: RouteConfig) {
  return (
    <Route
      path={route.path}
      render={(props: any) => <route.component {...props} />}
    />
  );
}
