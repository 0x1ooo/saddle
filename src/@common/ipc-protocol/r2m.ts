/* eslint-disable max-classes-per-file */

/* Renderer -> Main IPC Messages */
export class R2M {
  static readonly PROXY_COMMAND = 'ask-proxy-command';

  static readonly WINDOW_CLOSE = 'ask-close-wnd';

  static readonly WINDOW_MINIMIZE = 'ask-minimize-wnd';

  static readonly WINDOW_MAXIMIZE = 'ask-maximize-wnd';
}

/** Enums of the commands sent by UI process for proxy controlling */
export enum ProxyUICommand {
  Disable,
  Global,
  PAC,
}
