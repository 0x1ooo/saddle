import { ensureDirSync } from '@common/utils/fs';
import { configure, getLogger, shutdown } from 'log4js';
import path from 'path';

const logDir = path.join(__dirname, '../log');
const logFilename = 'main.log';

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

const service = getLogger('service');
const trojan = getLogger('trojan');
function initialize() {
  ensureDirSync(logDir);
  configure({
    appenders: {
      file: {
        type: 'file',
        filename: path.join(logDir, logFilename),
        layout: { type: 'basic' },
        maxLogSize: 5 * 1024 * 1024, // Max log file size is 5MB
      },
      stdout: {
        type: 'stdout',
        layout: { type: 'colored' },
      },
    },
    categories: {
      default: {
        appenders: ['stdout'],
        level: 'WARN',
      },
      serivce: {
        appenders: ['file', 'stdout'],
        level: 'INFO',
      },
      trojan: {
        appenders: ['file', 'stdout'],
        level: 'INFO',
      },
    },
  });
}
async function flush() {
  return new Promise<void>((resolve) => {
    shutdown((err) => {
      if (err) {
        console.error('logger flush error:', err); // eslint-disable-line no-console
      }
      resolve();
    });
  });
}

const logger = {
  service,
  trojan,
  initialize,
  flush,
};
export default logger;
