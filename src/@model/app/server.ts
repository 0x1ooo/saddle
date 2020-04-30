/** Supported proxy types that accepted by server */
export enum ProxyType {
  Unknown,
  Trojan,
}

/** Metadata of server entries, proxy independent. */
export interface ServerMeta {
  readonly id: string;
  readonly name: string;
  readonly type: ProxyType;
  readonly selected: boolean;
}

/** Persistent data that describes a server entry. Will be parsed and
 * built into runtime `ServerEntry` instances.
 */
export interface ServerConfig {
  meta: ServerMeta;
  conf: object;
}
/** Checks if given object is a legal `ServerConfig` */
export function isServerConfig(obj: any): obj is ServerConfig {
  return obj != null && typeof obj === 'object' && !!obj.meta && !!obj.conf;
}
