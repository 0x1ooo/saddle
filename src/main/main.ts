import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { appHub } from 'main/hub';
import log from 'main/log';
import { proxyService } from 'main/proxy';
import { disposeTray, initTray } from 'main/tray';
import windowManager from 'main/window/';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
/* eslint-disable-next-line global-require */
if (require('electron-squirrel-startup')) {
  app.quit();
}

log.initialize();

if (!app.requestSingleInstanceLock()) {
  log
    .main()
    .fatal(
      `Cannot get an instance lock. There might be another ${app.name} running.`
    );
  log.flush();
  app.exit();
}

async function startup() {
  if (isDev) {
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = await import(
      'electron-devtools-installer'
    );
    await installExtension([REACT_DEVELOPER_TOOLS]);
  }
  await appHub.initialize();
  initTray();
  await proxyService.initialize();
  await windowManager.initialize();
  global.startupFinished = true;
  log.main().warn('saddle launched.');
}

/** Cleanup things in async fashion before the process exists. */
async function cleanup(event: Event) {
  log.main().warn('gracefully stopping saddle...');

  // If the the application never started up, however in some case triggered
  // this listener, we don't what things to be cleaned up.
  if (!global.startupFinished) {
    return;
  }

  event.preventDefault();
  // Async cleanup codes here
  await proxyService.cleanup();
  await appHub.cleanup();

  log.main().info('things have been cleaned up');
  log.main().warn('bye.');
  await log.flush();
  process.exit();
}

async function dispose() {
  disposeTray();
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

app.on('will-quit', cleanup);
process.on('exit', dispose);
process.on('SIGINT', dispose);
process.on('SIGTERM', dispose);
