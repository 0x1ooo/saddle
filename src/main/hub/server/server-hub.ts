import { Events } from '@common/utils/events';
import { AppConfig } from '@model/app';
import { isServerConfig, ProxyType, ServerConfig } from '@model/app/server';
import { IServerEntryBuilder, ServerEntry } from 'main/hub/server/entry';
import { TrojanServer } from 'main/hub/server/trojan';
import log from 'main/log';

/** The map of proxy type to its `ServerEntry` type */
const proxyServerBuilders = new Map<ProxyType, IServerEntryBuilder>([
  [ProxyType.Trojan, TrojanServer],
]);

/** Defines what events the `ServerHub` would emit */
interface ServerHubEvents {
  updated: ServerConfig[];
}

/** Server hub reads and writes server entries from a config file,
 * and keeps the config file updated on data changes.
 *
 * It's also responsible to detect the changes that may change
 * the active proxy settings.
 */
export class ServerHub extends Events<ServerHubEvents> {
  private _builders = new Map<ProxyType, IServerEntryBuilder>();

  private _servers: ServerEntry[] = [];

  /** Classes that inherits `ServerEntry` must call this method
   * to bind itself with a specific `ServerType`, so to make it
   * recognizable to the server manager to be built from raw data.
   */
  registerBuilder(type: ProxyType, builder: IServerEntryBuilder) {
    this._builders.set(type, builder);
  }

  /** Loads all server entries from an `AppConfig` */
  load(appConfig: AppConfig) {
    this._servers = [];
    if (appConfig && appConfig.servers && appConfig.servers.length > 0) {
      appConfig.servers.forEach((data) => {
        const server = this.build(data);
        if (server) {
          this._servers.push(server);
        }
      });
    }
  }

  /** Dumps server entries into serializable `ServerConfig` */
  dump(): ServerConfig[] {
    return this._servers.map((server) => server.dump());
  }

  /** Parses and builds a server entry from marshalled raw data */
  build<T extends ServerEntry>(config: ServerConfig): T | null {
    try {
      if (!isServerConfig(config)) {
        throw new Error(
          `illegal server data\n${JSON.stringify(config, null, 2)}`
        );
      }
      const { meta } = config;
      const Builder = this._builders.get(meta.type);
      if (!Builder) {
        throw new Error(`unknown server type '${meta.type}'`);
      }
      return new Builder(config);
    } catch (e) {
      log.main().error(`bad server data: ${e}`);
      return null;
    }
  }

  list(): ServerEntry[] {
    return this._servers;
  }
}

/** The `ServerHub` singleton for server data management & dispatching */
export const serverHub = new ServerHub();

// Register
proxyServerBuilders.forEach((Builder, type) => {
  serverHub.registerBuilder(type, Builder);
});
