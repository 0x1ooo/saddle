import React from 'react';
import { Switch } from 'react-router-dom';
import { PageRoute, rootRoutes } from 'renderer/route';

export function MainView() {
  return (
    <Switch>
      {rootRoutes.map((route) => (
        <PageRoute key={route.path} path={route.path} {...route} />
      ))}
    </Switch>
  );
}
