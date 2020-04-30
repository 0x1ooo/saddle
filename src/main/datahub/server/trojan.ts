import { SystemConfig } from '@model/app/system';
import {
  getTrojanLogLevel,
  TrojanConf,
  trojanDefaultSystemConf,
  TrojanServerConf,
  TrojanSystemConf,
} from '@model/trojan';
import fs from 'fs';
import assign from 'lodash/assign';
import { ServerEntry } from 'main/datahub/server/entry';
import { trojanConfigPath } from 'main/proxy/trojan';

export class TrojanServer extends ServerEntry<TrojanServerConf> {
  getDetail(): ServerDetail {
    return {
      host: this.conf.remote_addr,
      port: this.conf.remote_port,
    };
  }

  async apply(sysConf: SystemConfig) {
    const conf = {
      ...TrojanServer.applySysConf(sysConf),
      ...this.conf,
    } as TrojanConf;
    return new Promise<void>((resolve, reject) =>
      fs.writeFile(trojanConfigPath, JSON.stringify(conf), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    );
  }

  /** Applies system config to the corresponding fields of a Trojan config */
  static applySysConf(sysConf: SystemConfig): TrojanSystemConf {
    return assign(trojanDefaultSystemConf, {
      local_addr: sysConf.allowLAN ? '0.0.0.0' : '127.0.0.1',
      local_port: sysConf.localPort,
      log_level: getTrojanLogLevel(sysConf.logLevel),
      log_file: sysConf.logFilename,
      buffer_size: sysConf.bufferSize,
    } as TrojanSystemConf);
  }
}
