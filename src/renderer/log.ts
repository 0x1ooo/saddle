import { makeLoggerOptions } from '@common/log';
import { ensureDirSync } from '@common/utils/fs';
import isDev from 'electron-is-dev';
import { configure, getLogger, shutdown } from 'log4js';
import path from 'path';

const logDir = isDev ? '/' : path.join(__dirname, '../log');
const logFilename = 'renderer.log';

function initialize() {
  ensureDirSync(logDir);
  const appenders = ['stdout', 'console'];
  if (!isDev) {
    appenders.push('file');
  }
  const options = makeLoggerOptions(logDir, logFilename, {
    appenders: {
      console: {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: '%[[%p] %d{yyyy/MM/dd hh:mm:ss}%]\n%m',
        },
      },
    },
    categories: {
      ui: {
        appenders,
        level: isDev ? 'ALL' : 'INFO',
      },
    },
  });
  configure(options);
}
async function flush() {
  return new Promise<void>((resolve) => {
    shutdown((err) => {
      if (err) {
        console.error('renderer logger flush error:', err); // eslint-disable-line no-console
      }
      resolve();
    });
  });
}

const log = {
  initialize,
  flush,
  ui: () => getLogger('ui'),
};
export default log;
