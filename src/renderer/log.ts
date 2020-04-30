import { LogLevel, makeLoggerOptions } from '@common/log';
import { ensureDirSync } from '@common/utils/fs';
import { remote } from 'electron';
import isDev from 'electron-is-dev';
import { configure, getLogger, shutdown } from 'log4js';

const logDir = isDev ? '/' : remote.app.getPath('logs');
const logFilename = 'renderer.log';

function initialize() {
  const appenders = ['stdout', 'console'];
  if (!isDev) {
    ensureDirSync(logDir);
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
        level: isDev ? LogLevel.All : LogLevel.Info,
      },
    },
  });
  configure(options);
  if (!isDev) {
    log.ui().info(`log files are kept at ${logDir}`);
  }
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
