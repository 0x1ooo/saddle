import { LogLevel } from '@common/log';
import {
  getTrojanLogLevel,
  trojanDefaultSystemConf,
  TrojanSystemConf,
} from '@data/trojan';
import assign from 'lodash/assign';

export class SystemConfig {
  logLevel: LogLevel = 'WARN';

  logFilename?: string;

  launchOnStartup = false;

  allowLAN = false;

  port = 7890;

  bufferSize = 512;

  toTrojanSystem(): TrojanSystemConf {
    return assign(trojanDefaultSystemConf, {
      local_addr: this.allowLAN ? '0.0.0.0' : '127.0.0.1',
      local_port: this.port,
      log_level: getTrojanLogLevel(this.logLevel),
      log_file: this.logFilename,
      buffer_size: this.bufferSize,
    } as TrojanSystemConf);
  }
}
