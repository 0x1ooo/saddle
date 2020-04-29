import { BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { openDevTools } from 'main/window/devtools';

declare const ABOUT_WINDOW_WEBPACK_ENTRY: string;
declare const ABOUT_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export async function createAboutWindow(
  parent?: BrowserWindow
): Promise<BrowserWindow> {
  // Create the browser window.
  const wnd = new BrowserWindow({
    width: 400,
    height: 500,
    titleBarStyle: 'hidden',
    type: 'toolbar',
    parent,
    modal: !!parent,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      preload: ABOUT_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  wnd.removeMenu();
  // and load the index.html of the app.
  wnd.loadURL(`${ABOUT_WINDOW_WEBPACK_ENTRY}/#about`);

  // Open the DevTools.
  if (isDev) {
    openDevTools(wnd);
  }
  return wnd;
}
