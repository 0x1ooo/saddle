import React from 'react';
import { hot } from 'react-hot-loader';
import { Link, MemoryRouter, Switch } from 'react-router-dom';
import { PageRoute, routes } from 'renderer/route';

const MainFrame = () => {
  return (
    <MemoryRouter>
      <div>
        <div>Main Window -wxxxx</div>
      </div>
      <Link to="/about">About</Link>
      <Link to="/test">Test</Link>
      <Switch>
        {routes.map((route, i) => (
          <PageRoute key={route.path} path={route.path} {...route} />
        ))}
      </Switch>
    </MemoryRouter>
  );
};

export default hot(module)(MainFrame);
