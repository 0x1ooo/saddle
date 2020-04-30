import {
  isServerData,
  ServerEntry,
  ServerMeta,
  ServerType,
} from '@data/app/server/base';

/** This interface defines the constructor's shape of any class that
 * derived from `ServerEntry`.
 */
export interface IServerBuilder<T extends ServerEntry = any> {
  new (meta: ServerMeta, conf: any): T;
}

export class ServerManager {
  private _builders = new Map<ServerType, IServerBuilder>();

  private _servers: ServerEntry[] = [];

  /** Classes that inherits `ServerEntry` must call this method
   * to bind itself with a specific `ServerType`, so to make it
   * recognizable to the server manager to be built from raw data.
   */
  registerBuilder(type: ServerType, builder: IServerBuilder) {
    this._builders.set(type, builder);
  }

  // async load(filepath: string) {}

  /** Parses and builds a server entry from marshalled raw data */
  build<T extends ServerEntry>(raw: string): T {
    try {
      const obj = JSON.parse(raw);
      if (!isServerData(obj)) {
        throw new Error(
          `invalid server data: \n${JSON.stringify(obj, null, 2)}`
        );
      }
      const { meta, conf } = obj;
      const Builder = this._builders.get(meta.type);
      if (!Builder) {
        throw new Error(
          `invalid server data: unknown server type '${meta.type}'`
        );
      }
      return new Builder(meta, conf);
    } catch (e) {
      throw new Error(`invalid server data: ${e}`);
    }
  }

  list(): ServerEntry[] {
    return this._servers;
  }
}

/** Server manager reads and writes server entries from a config file,
 * and keeps the config file updated on data changes.
 *
 * It's also responsible to detect the changes that may change
 * the active proxy settings.
 */
export const servers = new ServerManager();
global.servers = servers;
