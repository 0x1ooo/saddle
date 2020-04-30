import { LogLevel, makeLoggerOptions } from '@common/log';
import { ensureDirSync } from '@common/utils/fs';
import { app } from 'electron';
import isDev from 'electron-is-dev';
import { configure, getLogger, shutdown } from 'log4js';
import path from 'path';

const logDir = isDev ? path.join(__dirname, '../log') : app.getPath('logs');
const logFilename = 'main.log';

function initialize() {
  ensureDirSync(logDir);
  const options = makeLoggerOptions(logDir, logFilename, {
    categories: {
      main: {
        appenders: ['file', 'stdout'],
        level: isDev ? LogLevel.All : LogLevel.Info,
      },
      trojan: {
        appenders: ['file', 'stdout'],
        level: LogLevel.Info,
      },
    },
  });
  configure(options);
  log.main().info(`log files are kept at ${logDir}`);
}
async function flush() {
  return new Promise<void>((resolve) => {
    shutdown((err) => {
      if (err) {
        console.error('main logger flush error:', err); // eslint-disable-line no-console
      }
      resolve();
    });
  });
}

const log = {
  initialize,
  flush,
  main: () => getLogger('main'),
  trojan: () => getLogger('trojan'),
};
export default log;
