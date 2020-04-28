/* eslint-disable max-classes-per-file */

/* Main -> Renderer IPC Messages */
export class M2R {
  static readonly PROXY_BUSY = 'tell-proxy-busy';

  static readonly PROXY_ENABLED = 'tell-proxy-enabled';

  static readonly PROXY_DISABLED = 'tell-proxy-disabled';

  static readonly PROXY_ERROR = 'tell-proxy-error';
}
export class ProxyError extends Error {
  constructor(readonly code: ProxyCode, message: string) {
    super(message);
  }
}
export enum ProxyCode {
  NoError = 0,
  TrojanNotFound,
  TrojanNotSpawned,
  TrojanInternalError = 500,
}
