import { useTheme } from '@material-ui/core/styles';
import React from 'react';
import { hot } from 'react-hot-loader';
import { MemoryRouter, Switch } from 'react-router-dom';
import TitleBar, { WindowButtonFlag } from 'renderer/components/frame/TitleBar';
import { PageRoute, routes } from 'renderer/route';

const ToolFrame = () => {
  const theme = useTheme();
  return (
    <MemoryRouter>
      <div
        className="window-frame"
        style={{
          background: theme.palette.primary.dark,
          color: theme.palette.primary.light,
        }}
      >
        <TitleBar buttonFlags={WindowButtonFlag.Tool} noIcon={true} />
        <Switch>
          {routes.map((route) => (
            <PageRoute key={route.path} path={route.path} {...route} />
          ))}
        </Switch>
      </div>
    </MemoryRouter>
  );
};

export default hot(module)(ToolFrame);
