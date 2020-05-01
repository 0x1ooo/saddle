import { ServerConfig } from '@model/app/server';
import { defaultSystemConfig, SystemConfig } from '@model/app/system';
import merge from 'lodash/merge';

export interface AppConfig {
  system: SystemConfig;
  servers: ServerConfig[];
}

export function isAppConfig(obj: any): obj is AppConfig {
  return (
    obj != null &&
    typeof obj === 'object' &&
    'system' in obj &&
    'servers' in obj
  );
}

export function readAppConfig(raw: string, base?: AppConfig): AppConfig {
  const obj = JSON.parse(raw);
  const defaults = base || defaultAppConfig;
  if (isAppConfig(obj)) {
    return merge({}, defaults, obj);
  }
  throw new Error('illegal app config');
}

export const defaultAppConfig = {
  system: defaultSystemConfig,
  servers: [],
};
