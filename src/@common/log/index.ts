import { ensureDirSync } from '@common/utils/fs';
import merge from 'lodash/merge';
import { Configuration } from 'log4js';
import path from 'path';

export type LogLevel =
  | 'ALL'
  | 'TRACE'
  | 'DEBUG'
  | 'INFO'
  | 'WARN'
  | 'ERROR'
  | 'FATAL'
  | 'MARK'
  | 'OFF';
export function makeLoggerOptions(
  logDir: string,
  logFilename: string,
  customOptions: Partial<Configuration>
): Configuration {
  ensureDirSync(logDir);
  return merge(
    {
      appenders: {
        stdout: {
          type: 'stdout',
          layout: { type: 'colored' },
        },
        file: {
          type: 'file',
          filename: path.join(logDir, logFilename),
          layout: { type: 'basic' },
          maxLogSize: 5 * 1024 * 1024, // Max log file size is 5MB
        },
      },
      categories: {
        default: {
          appenders: ['stdout'],
          level: 'WARN',
        },
      },
    },
    customOptions
  );
}

function isFileEnabled() {
  console.log('node env', process.env.NODE_ENVIRONMENT);
  return process.env.NODE_ENVIRONMENT === 'production';
}
