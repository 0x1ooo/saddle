import { ProxyType, ServerEntry, ServerMeta } from '@data/app/server/base';
import { servers } from '@data/app/server/manager';
import { SystemConfig } from '@data/app/system';
import {
  getTrojanLogLevel,
  TrojanConf,
  trojanDefaultSystemConf,
  TrojanServerConf,
  TrojanSystemConf,
} from '@data/trojan';
import assign from 'lodash/assign';

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
      ...TrojanServer.convertSysConf(sysConf),
      ...this.conf,
    } as TrojanConf;
  }

  static convertSysConf(sysConf: SystemConfig): TrojanSystemConf {
    return assign(trojanDefaultSystemConf, {
      local_addr: sysConf.allowLAN ? '0.0.0.0' : '127.0.0.1',
      local_port: sysConf.localPort,
      log_level: getTrojanLogLevel(sysConf.logLevel),
      log_file: sysConf.logFilename,
      buffer_size: sysConf.bufferSize,
    } as TrojanSystemConf);
  }
}

servers.registerBuilder(ProxyType.Trojan, TrojanServer);
