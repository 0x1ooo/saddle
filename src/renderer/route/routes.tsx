import React, { ComponentClass, FunctionComponent } from 'react';
import { Route } from 'react-router-dom';
import * as test from './test-comps';

interface RouteConfig {
  path: string;
  component: FunctionComponent | ComponentClass;
  routes?: RouteConfig[];
}
export const routes: RouteConfig[] = [
  { path: '/about', component: test.About },
  { path: '/test', component: test.Test },
  { path: '/', component: test.Home },
];

export function PageRoute(route: RouteConfig) {
  return (
    <Route
      path={route.path}
      render={(props: any) => <route.component {...props} />}
    />
  );
}
