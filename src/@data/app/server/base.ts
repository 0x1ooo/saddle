import { SystemConfig } from '@data/app/system';

export enum ServerType {
  Unknown,
  Trojan,
}

export interface ServerMeta {
  readonly id: string;
  readonly name: string;
  readonly type: ServerType;
  readonly selected: boolean;
}

export interface ServerDetail {
  readonly host: string;
  readonly port: number;
}

export interface ServerData {
  meta: ServerMeta;
  conf: object;
}
export function isServerData(obj: any): obj is ServerData {
  return obj != null && typeof obj === 'object' && !!obj.meta && !!obj.conf;
}

export abstract class ServerBase {
  constructor(readonly meta: ServerMeta) {}

  /** Get more detailed information other than meta.
   * The retrieved data can be used for UI display;
   */
  abstract getDetail(): ServerDetail;

  /** Generate a config object of this server */
  abstract generate(sysConf: SystemConfig): object;

  /** Marshal (serialize) the server data info the form
   * that can be saved on the file system;
   */
  marshal() {
    return JSON.stringify(this);
  }
}
