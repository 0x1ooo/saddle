/* eslint-disable max-classes-per-file */

/* Main -> Renderer IPC Messages */
export class M2R {
  static readonly PROXY_BUSY = 'tell-trojan-busy';

  static readonly PROXY_ENABLED = 'tell-trojan-started';

  static readonly PROXY_DISABLED = 'tell-trojan-stopped';

  static readonly PROXY_ERROR = 'tell-trojan-error';
}
export class TrojanError extends Error {
  constructor(readonly code: TrojanErrCode, message: string) {
    super(message);
  }
}
export enum TrojanErrCode {
  NoError = 0,
  ExecNotFound,
  FailingSpawn,
  InternalError = 500,
}
