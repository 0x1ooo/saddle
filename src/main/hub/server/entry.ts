import { ServerConfig, ServerMeta } from '@model/app/server';
import { SystemConfig } from '@model/app/system';

/** This interface defines the constructor's shape of any class that
 * derived from `ServerEntry`.
 */
export interface IServerEntryBuilder<T extends ServerEntry = any> {
  new (config: ServerConfig): T;
}

/** A `ServerEntry` describes a set of proxy server settings in the runtime
 * as well as necessary operations. Its derived classes take in charge of
 * proxy-specific actions.
 * @param TConf The config data structure depending on proxy
 * */
export abstract class ServerEntry<TConf = any> {
  meta: ServerMeta;

  conf: TConf;

  constructor(config: ServerConfig) {
    this.meta = config.meta;
    this.conf = (config.conf as any) as TConf;
  }

  /** Gets more detailed information other than meta.
   * The retrieved data can be used for UI display;
   */
  abstract getDetail(): ServerDetail;

  /** Generates a config object of this server */
  abstract apply(sysConf: SystemConfig): void;

  /** Dumps the server entry into serializable `ServerConfig` so that
   *  can be saved on the file system;
   */
  dump(): ServerConfig {
    return {
      meta: this.meta,
      conf: this.conf as any,
    };
  }
}
