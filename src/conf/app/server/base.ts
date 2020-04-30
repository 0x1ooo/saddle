import { SystemConfig } from 'conf/app/system';

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

export abstract class ServerBase {
  constructor(readonly meta: ServerMeta) {}

  abstract getDetail(): ServerDetail;

  abstract generate(sysConf: SystemConfig): object;
}
