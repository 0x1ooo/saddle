import { BrowserWindow } from 'electron';

declare const ABOUT_WINDOW_WEBPACK_ENTRY: string;
declare const ABOUT_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export async function createAboutWindow(
  parent?: BrowserWindow
): Promise<BrowserWindow> {
  // Create the browser window.
  const wnd = new BrowserWindow({
    width: 1080,
    height: 900,
    titleBarStyle: 'hidden',
    type: 'toolbar',
    parent,
    modal: !!parent,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      preload: ABOUT_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  wnd.removeMenu();
  // and load the index.html of the app.
  wnd.loadURL(`${ABOUT_WINDOW_WEBPACK_ENTRY}/#about`);

  // Open the DevTools.
  // if (isDev) {
  wnd.webContents.openDevTools();
  // }
  return wnd;
}
