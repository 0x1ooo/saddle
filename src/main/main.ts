import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { proxyService } from 'main/proxy';
import { initTray } from 'main/tray';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
/* eslint-disable-next-line global-require */
if (require('electron-squirrel-startup')) {
  app.quit();
}

async function createWindow(): Promise<void> {
  if (isDev) {
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = await import(
      'electron-devtools-installer'
    );
    await installExtension([REACT_DEVELOPER_TOOLS]);
  }
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // if (isDev) {
  mainWindow.webContents.openDevTools();
  // }

  initTray();
  await proxyService.initialize();

  console.log('saddle launched.');
}

/** Cleanup things in async fashion before the process exists. */
async function cleanup(event: Event) {
  console.log('gracefully stopping saddle...');
  event.preventDefault();

  // Cleanup codes here

  console.log('things have been cleaned up');
  process.exit();
}
async function dispose() {
  console.log('disposing...');
  proxyService.dispose();
  console.log('bye.');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', cleanup);
process.on('exit', dispose);
process.on('SIGINT', dispose);
process.on('SIGTERM', dispose);
