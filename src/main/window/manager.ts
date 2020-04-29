import { BrowserWindow } from 'electron';
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
}

const windowManager = new WindowManager();
export default windowManager;
