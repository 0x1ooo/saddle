/* ---------------- Trojan-go JSON Types ---------------- */

import { LogLevel } from '@common/log';

/** Trojan log levels */
export enum TrojanLogLevel {
  All = 0,
  Debug = 0,
  Info,
  Warning,
  Error,
  Fatal,
  None,
}
export function getTrojanLogLevel(level: LogLevel) {
  switch (level) {
    case 'ALL':
      return TrojanLogLevel.All;
    case 'TRACE':
    case 'DEBUG':
      return TrojanLogLevel.Debug;
    case 'INFO':
      return TrojanLogLevel.Info;
    case 'WARN':
      return TrojanLogLevel.Warning;
    case 'ERROR':
      return TrojanLogLevel.Error;
    case 'FATAL':
    case 'MARK':
      return TrojanLogLevel.Fatal;
    default:
      return TrojanLogLevel.None;
  }
}

/** The complete Trojan-go config structure */
export interface TrojanConf {
  run_type: 'client';
  local_addr: string;
  local_port: number;
  remote_addr: string;
  remote_port: number;
  password: string[];

  log_level?: TrojanLogLevel;
  log_file?: string;
  buffer_size?: number;

  ssl?: TrojanSSLConf;
  tcp?: TrojanTCPConf;
  mux?: TrojanMuxConf;
  router?: TrojanRouterConf;
  websocket?: TrojanWebsocketConf;
}
/** SSL config of Trojan-go */
export interface TrojanSSLConf {
  verify?: boolean;
  verify_hostname?: boolean;
  cert?: string;
  key?: string;
  key_password?: string;
  cipher?: string;
  cipher_tls13?: string;
  curves?: string;
  prefer_server_cipher?: boolean;
  sni?: string;
  alpn?: string[];
  fingerprint?: '' | 'auto' | 'firefox' | 'chrome' | 'ios' | 'randomized';
  session_ticket?: boolean;
  reuse_session?: boolean;
}
/** TCP config of Trojan-go */
export interface TrojanTCPConf {
  no_delay?: boolean;
  keep_alive?: boolean;
  reuse_port?: boolean;
  prefer_ipv4?: boolean;
  fast_open?: boolean;
  fast_open_qlen?: number;
}
/** Mux config of Trojan-go */
export interface TrojanMuxConf {
  enabled?: boolean;
  concurrency?: number;
  idle_timeout?: number;
}
/** Router config of Trojan-go */
export interface TrojanRouterConf {
  enabled?: boolean;
  bypass?: string[];
  proxy?: string[];
  block?: string[];
  default_policy?: 'proxy' | 'bypass' | 'block';
  route_by_ip?: boolean;
  route_by_ip_on_nonmatch?: boolean;
  geoip?: string;
  geosite?: string;
}
/** Websocket config of Trojan-go */
export interface TrojanWebsocketConf {
  enabled?: boolean;
  hostname?: string;
  path?: string;
  obfuscation_password?: string;
  double_tls?: boolean;
  double_tls_verify?: boolean;
}

/* ---------------- Derived Types ---------------- */

/** Essential settings for connecting to a Trojan server */
export type TrojanServerEssentialConf = Pick<
  TrojanConf,
  'remote_addr' | 'remote_port' | 'password' | 'websocket'
>;

/** Trojan settings to override the system defaults for a specific Trojan server */
export type TrojanServerOverridableConf = Pick<
  TrojanConf,
  'ssl' | 'tcp' | 'router' | 'mux'
>;

/** Settings that can be set for a single Trojan server */
export type TrojanServerConf = TrojanServerEssentialConf &
  TrojanServerOverridableConf;

/** Default Trojan server settings for further editing */
export const trojanDefaultServerConf: TrojanServerConf = {
  remote_addr: '',
  remote_port: 443,
  password: [],
};

/** Settings that used for the proxy/network/client on local machine */
export type TrojanSystemConf = Omit<TrojanConf, keyof TrojanServerConf>;

/** Default Trojan system settings */
export const trojanDefaultSystemConf: TrojanSystemConf = {
  run_type: 'client',
  local_addr: '127.0.0.1',
  local_port: 7890,
};

// TODO: SQLite, API
