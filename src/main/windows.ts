import { BrowserWindow } from 'electron';
import log from 'main/log';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export type WindowType = 'main' | 'about';

const windowBuilders: { [type in WindowType]: () => Promise<BrowserWindow> } = {
  main: createMainWindow,
  about: async () => {
    throw new Error('not implemented');
  },
};

async function createMainWindow(): Promise<BrowserWindow> {
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
  return mainWindow;
}

class WindowManager {
  private readonly _openWindows = new Map<WindowType, BrowserWindow>();

  async open(type: WindowType) {
    let wnd: BrowserWindow | undefined;
    if (this._openWindows.has(type)) {
      wnd = this._openWindows.get(type);
    }
    if (!wnd) {
      const builder = windowBuilders[type];
      try {
        wnd = await builder();
        if (wnd) {
          wnd.on('close', () => this._onWindowClosed(wnd!));
        }
      } catch (e) {
        log.main().error(`failed creating a ${type} window`, e);
      }
    }
    if (wnd) {
      this._openWindows.set(type, wnd);
      if (wnd.isMinimized()) {
        wnd.restore();
      }
      wnd.focus();
    }
  }

  private _onWindowClosed(wnd: BrowserWindow) {
    this._openWindows.forEach((managed, type) => {
      if (managed === wnd) {
        this._openWindows.delete(type);
      }
    });
  }
}

const windowManager = new WindowManager();
export default windowManager;
