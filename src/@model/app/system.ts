import { LogLevel } from '@common/log';

export interface SystemConfig {
  logLevel: LogLevel;
  logFilename: string;
  launchOnStartup: boolean;
  allowLAN: boolean;
  localPort: number;
  bufferSize: number;
}
export const defaultSystemConfig = {
  logLevel: LogLevel.Warn,
  logFilename: '',
  launchOnStartup: false,
  allowLAN: false,
  localPort: 7890,
  bufferSize: 512,
} as SystemConfig;
