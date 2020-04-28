/* Main -> Renderer IPC Messages */

export class M2R {
  static readonly TROJAN_BUSY = 'tell-trojan-busy';

  static readonly TROJAN_STARTED = 'tell-trojan-started';

  static readonly TROJAN_STOPPED = 'tell-trojan-stopped';

  static readonly TROJAN_ERROR = 'tell-trojan-error';
}
