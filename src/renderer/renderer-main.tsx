/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import MainFrame from 'renderer/components/frame/MainFrame';
import log from 'renderer/log';
import hotSteel from 'renderer/theme/hot-steel';
import './index.scss';

log.initialize();
log
  .ui()
  .info(
    '👋 This message is being logged by "renderer.js", included via webpack'
  );

ReactDOM.render(
  <ThemeProvider theme={hotSteel}>
    <AppContainer>
      <MainFrame />
    </AppContainer>
  </ThemeProvider>,
  document.getElementById('root')
);
