/* eslint-disable max-classes-per-file */

/* Renderer -> Main IPC Messages */
export class R2M {
  static readonly PROXY_COMMAND = 'ask-proxy-command';
}

/** Enums of the commands sent by UI process for proxy controlling */
export enum ProxyUICommand {
  Disable,
  Global,
  PAC,
}
