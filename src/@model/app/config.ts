import { ServerConfig } from '@model/app/server';
import { SystemConfig } from '@model/app/system';

export interface AppConfig {
  system: SystemConfig;
  servers: ServerConfig[];
}
