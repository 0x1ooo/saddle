import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import log from 'main/log';
import { proxyService } from 'main/proxy';
import { initTray } from 'main/tray';
import windowManager from 'main/window/';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
/* eslint-disable-next-line global-require */
if (require('electron-squirrel-startup')) {
  app.quit();
}

log.initialize();
async function startup() {
  if (isDev) {
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = await import(
      'electron-devtools-installer'
    );
    await installExtension([REACT_DEVELOPER_TOOLS]);
  }
  initTray();
  await proxyService.initialize();
  await windowManager.initialize();
  log.main().warn('saddle launched.');
}

/** Cleanup things in async fashion before the process exists. */
async function cleanup(event: Event) {
  log.main().warn('gracefully stopping saddle...');
  event.preventDefault();

  // Async cleanup codes here
  await log.flush();

  log.main().info('things have been cleaned up');
  log.main().warn('bye.');
  process.exit();
}
async function dispose() {
  proxyService.dispose();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  await startup();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    windowManager.open('main');
  }
});

app.on('before-quit', cleanup);
process.on('exit', dispose);
process.on('SIGINT', dispose);
process.on('SIGTERM', dispose);
