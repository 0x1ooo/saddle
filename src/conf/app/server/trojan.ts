import { ServerBase, ServerDetail, ServerMeta } from 'conf/app/server/base';
import { SystemConfig } from 'conf/app/system';
import { TrojanConf, TrojanServerConf } from 'conf/trojan';

export class TrojanServer extends ServerBase {
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
