import { R2M } from '@common/ipc-protocol';
import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain,
  IpcMainEvent,
} from 'electron';
import isDev from 'electron-is-dev';
import defaults from 'lodash/defaults';
import log from 'main/log';
import { openDevTools } from 'main/window/devtools';
import { FrameFlag } from 'renderer/components/frame/define';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

type WindowKey = 'main' | 'about';

interface WindowConfig extends Electron.BrowserWindowConstructorOptions {
  /** The route path that navigates to on window open. */
  path: string;
  /** The title of this window. */
  title?: string;
  /** Frame flag that controls the apperance of the new window instance */
  flag?: FrameFlag;
  /** To which WindowKey's instance this window try to set as its parent.
   * Attach to nothing if parent instance is not found.
   */
  attachTo?: WindowKey;
  /** When set to `true`, this window is created as modal if it has a parent. */
  modalWhenPossible?: boolean;
}

/** Configurations for each WindowKey */
const windowConfigs: { [type in WindowKey]: WindowConfig } = {
  main: { path: '/', width: 1080, height: 900, modal: true },
  about: {
    title: '关于',
    path: '/about',
    flag: FrameFlag.Tool,
    width: 400,
    height: 500,
    titleBarStyle: 'hidden',
    type: 'toolbar',
    resizable: false,
    attachTo: 'main',
    modalWhenPossible: true,
  },
};

/** Manages all windows in the app.
 * - There can be only one window instance for each WindowKey.
 * - Open a window by a given WindowKey.
 * - A window is registered to the manager when created.
 * - A window is unregistered from the manager when closed.
 * - Trying to open by a WindowKey that already owns an instance will restore (if minimized)
 * and focus the existing instance.
 */
class WindowManager {
  private readonly _openWindows = new Map<WindowKey, BrowserWindow>();

  initialize() {
    ipcMain.on(R2M.WINDOW_CLOSE, WindowManager._onCloseWindow.bind(this));
    ipcMain.on(R2M.WINDOW_MINIMIZE, WindowManager._onMinimizeWindow.bind(this));
    ipcMain.on(R2M.WINDOW_MAXIMIZE, WindowManager._onMaximizeWindow.bind(this));
    log.main().trace('window manager initialized');
  }

  async open(type: WindowKey) {
    let wnd = this.get(type);
    if (!wnd) {
      const config = windowConfigs[type];
      try {
        wnd = this._create(config);
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

  get(type: WindowKey) {
    return this._openWindows.get(type);
  }

  private _create(config: WindowConfig) {
    // Here are some forced options for BrowserWindow
    let options: BrowserWindowConstructorOptions = {
      frame: false,
      backgroundColor: '#455A64',
      webPreferences: {
        nodeIntegration: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    };
    if (config) {
      // We'll take the options with this priority:
      // Forced Options > WindowConfig > Built-in BrowserWindow options
      const parent = config.attachTo ? this.get(config.attachTo) : undefined;
      const modal = config.modalWhenPossible ? !!parent : undefined;
      options = defaults(
        {},
        options,
        {
          parent,
          modal,
        },
        config
      );
    }
    const wnd = new BrowserWindow(options);
    // The page URL for window is of format:
    // <scheme>://WEBPACK_ENTRY_URL？query=<initial route path>&title=<window title>&flag=<frame flag>
    const query = new URLSearchParams();
    let { path } = config;
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    query.append('path', path);
    if (config.title != null) {
      query.append('title', config.title);
    }
    if (config.flag != null) {
      query.append('flag', `${config.flag}`);
    }
    const wndURL = `${MAIN_WINDOW_WEBPACK_ENTRY}?${query.toString()}`;
    wnd.loadURL(wndURL);
    log.main().trace(`open window @ ${wndURL}`);

    // Open the DevTools.
    if (isDev) {
      openDevTools(wnd);
    }
    return wnd;
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
