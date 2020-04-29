import { R2M } from '@common/ipc-protocol';
import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import log from 'main/log';
import { createAboutWindow } from 'main/window/about-window';
import { createMainWindow } from 'main/window/main-window';

export type WindowType = 'main' | 'about';

const windowBuilders: { [type in WindowType]: () => Promise<BrowserWindow> } = {
  main: createMainWindow,
  about: async () => {
    const parent = windowManager.get('main');
    return createAboutWindow(parent);
  },
};

class WindowManager {
  private readonly _openWindows = new Map<WindowType, BrowserWindow>();

  initialize() {
    ipcMain.on(R2M.WINDOW_CLOSE, WindowManager._onCloseWindow.bind(this));
    ipcMain.on(R2M.WINDOW_MINIMIZE, WindowManager._onMinimizeWindow.bind(this));
    ipcMain.on(R2M.WINDOW_MAXIMIZE, WindowManager._onMaximizeWindow.bind(this));
    log.main().trace('window manager initialized');
  }

  async open(type: WindowType) {
    let wnd = this.get(type);
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

  get(type: WindowType) {
    return this._openWindows.get(type);
  }

  private _onWindowClosed(wnd: BrowserWindow) {
    this._openWindows.forEach((managed, type) => {
      if (managed === wnd) {
        this._openWindows.delete(type);
      }
    });
  }

  private static _onCloseWindow(event: IpcMainEvent) {
    const wnd = BrowserWindow.fromWebContents(event.sender);
    if (wnd) {
      wnd.close();
    }
  }

  private static _onMinimizeWindow(event: IpcMainEvent) {
    const wnd = BrowserWindow.fromWebContents(event.sender);
    if (wnd && wnd.minimizable) {
      wnd.minimize();
    }
  }

  private static _onMaximizeWindow(event: IpcMainEvent) {
    const wnd = BrowserWindow.fromWebContents(event.sender);
    if (wnd) {
      wnd.isMaximized() ? wnd.restore() : wnd.maximize();
    }
  }
}

const windowManager = new WindowManager();
export default windowManager;
