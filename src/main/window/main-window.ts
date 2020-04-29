import { BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { openDevTools } from 'main/window/devtools';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export async function createMainWindow(): Promise<BrowserWindow> {
  // Create the browser window.
  const wnd = new BrowserWindow({
    width: 1080,
    height: 900,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  wnd.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (isDev) {
    openDevTools(wnd);
  }
  return wnd;
}
