import { makeLoggerOptions } from '@common/log';
import { ensureDirSync } from '@common/utils/fs';
import { configure, getLogger, shutdown } from 'log4js';
import path from 'path';

const logDir = path.join(__dirname, '../log');
const logFilename = 'main.log';

function initialize() {
  ensureDirSync(logDir);
  const options = makeLoggerOptions(logDir, logFilename, {
    categories: {
      main: {
        appenders: ['file', 'stdout'],
        level: 'INFO',
      },
      trojan: {
        appenders: ['file', 'stdout'],
        level: 'INFO',
      },
    },
  });
  configure(options);
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
