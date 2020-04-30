/* ---------------- Trojan-go JSON Types ---------------- */
/** The complete Trojan-go config structure */
export interface TrojanConfig {
  run_type: 'client';
  local_addr: string;
  local_port: number;
  remote_addr: string;
  remote_port: number;
  password: string[];

  log_level?: number;
  log_file?: string;
  buffer_size?: number;

  ssl?: TrojanSSLConfig;
  tcp?: TrojanTCPConfig;
  mux?: TrojanMuxConfig;
  router?: TrojanRouterConfig;
  websocket?: TrojanWebsocketConfig;
}
/** SSL config of Trojan-go */
export interface TrojanSSLConfig {
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
export interface TrojanTCPConfig {
  no_delay?: boolean;
  keep_alive?: boolean;
  reuse_port?: boolean;
  prefer_ipv4?: boolean;
  fast_open?: boolean;
  fast_open_qlen?: number;
}
/** Mux config of Trojan-go */
export interface TrojanMuxConfig {
  enabled?: boolean;
  concurrency?: number;
  idle_timeout?: number;
}
/** Router config of Trojan-go */
export interface TrojanRouterConfig {
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
export interface TrojanWebsocketConfig {
  enabled?: boolean;
  hostname?: string;
  path?: string;
  obfuscation_password?: string;
  double_tls?: boolean;
  double_tls_verify?: boolean;
}

/* ---------------- Derived Types ---------------- */

/** Essential settings for connecting to a Trojan server */
export type TrojanServerEssential = Pick<
  TrojanConfig,
  'remote_addr' | 'remote_port' | 'password' | 'websocket'
>;

/** Trojan settings to override the system defaults for a specific Trojan server */
export type TrojanServerOverridable = Pick<
  TrojanConfig,
  'ssl' | 'tcp' | 'router' | 'mux'
>;

/** Settings that can be set for a single Trojan server */
export type TrojanServer = TrojanServerEssential & TrojanServerOverridable;

/** Default Trojan server settings for further editing */
export const trojanDefaultServer: TrojanServer = {
  remote_addr: '',
  remote_port: 443,
  password: [],
};

/** Settings that used for the proxy/network/client on local machine */
export type TrojanSystem = Omit<TrojanConfig, keyof TrojanServer>;

/** Default Trojan system settings */
export const trojanDefaultSystem: TrojanSystem = {
  run_type: 'client',
  local_addr: '127.0.0.1',
  local_port: 7890,
};

// TODO: SQLite, API
