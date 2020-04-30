import {
  isServerData,
  ServerBase,
  ServerMeta,
  ServerType,
} from '@data/app/server/base';

export interface IServerBuilder<T extends ServerBase = any> {
  new (meta: ServerMeta, conf: any): T;
}

class ServerManager {
  private _builders = new Map<ServerType, IServerBuilder>();

  registerBuilder(type: ServerType, builder: IServerBuilder) {
    this._builders.set(type, builder);
  }

  build<T extends ServerBase>(raw: string): T {
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
}

export const serverManager = new ServerManager();
