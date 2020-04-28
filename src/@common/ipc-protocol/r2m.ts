/* eslint-disable max-classes-per-file */

/* Renderer -> Main IPC Messages */
export class R2M {
  static readonly START_PROXY = 'ask-start-proxy';

  static readonly STOP_PROXY = 'ask-stop-proxy';
}

/** Enums of the commands sent by UI process for proxy controlling */
export enum ProxyUICommand {
  Global,
  PAC,
  Disable,
}
