import { Box, useTheme } from '@material-ui/core';
import { remote } from 'electron';
import React from 'react';
import { hot } from 'react-hot-loader';
import { MemoryRouter, Switch } from 'react-router-dom';
import { FrameFlag } from 'renderer/components/frame/define';
import TitleBar from 'renderer/components/frame/TitleBar';
import log from 'renderer/log';
import { PageRoute, rootRoutes } from 'renderer/route';

/** Parsed frame queries for window startup */
interface FrameQueryData {
  /** The window title which is set to `document.title` */
  title: string;
  /** The initial route path */
  path: string;
  /** The `FrameFlag` used for title bar's apperance */
  frameFlags?: FrameFlag;
}

function parseQuery(): FrameQueryData {
  const { href } = window.location;
  const qMark = href.indexOf('?');
  if (qMark < 0 || qMark === href.length - 1) {
    return { title: remote.app.name, path: '/' };
  }
  const query = new URLSearchParams(href.substr(qMark + 1));
  const frameFlags = +(query.get('flag') || '');
  return {
    title: query.get('title') || remote.app.name,
    path: query.get('path') || '/',
    frameFlags: isNaN(frameFlags) ? undefined : frameFlags,
  };
}

/** The app's window frame.
 * Should be used as the root presentational element. */
function Frame() {
  const theme = useTheme();
  const query = parseQuery();
  log.ui().debug('frame query', query);
  document.title = query.title;
  return (
    <div
      className="window-frame"
      style={{
        background: theme.palette.primary.dark,
        color: theme.palette.primary.light,
      }}
    >
      <div className="window-body">
        <TitleBar {...query} />
        <Box>
          <MemoryRouter initialEntries={[query.path]}>
            <Switch>
              {...rootRoutes.map((route) => (
                <PageRoute key={route.path} path={route.path} {...route} />
              ))}
            </Switch>
          </MemoryRouter>
        </Box>
      </div>
    </div>
  );
}

export default hot(module)(Frame);
