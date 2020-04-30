import { ServerEntry, ServerMeta, ServerType } from '@data/app/server/base';
import { servers } from '@data/app/server/manager';
import { SystemConfig } from '@data/app/system';
import { TrojanConf, TrojanServerConf } from '@data/trojan';

export class TrojanServer extends ServerEntry {
  constructor(meta: ServerMeta, readonly conf: TrojanServerConf) {
    super(meta);
  }

  getDetail(): ServerDetail {
    return {
      host: this.conf.remote_addr,
      port: this.conf.remote_port,
    };
  }

  generate(sysConf: SystemConfig): object {
    return {
      ...sysConf.toTrojanSystem(),
      ...this.conf,
    } as TrojanConf;
  }
}

servers.registerBuilder(ServerType.Trojan, TrojanServer);
