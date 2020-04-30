import { LogLevel, makeLoggerOptions } from '@common/log';
import { FileAppender } from 'log4js';
import path from 'path';

it('makes a merged logger options w/ given file path', () => {
  const customCat = { appenders: [], level: LogLevel.Trace };
  const opts = makeLoggerOptions('a', 'b.log', {
    categories: {
      test: customCat,
    },
  });
  expect((opts.appenders.file as FileAppender).filename).toBe(
    path.join('a', 'b.log')
  );
  expect(Object.keys(opts.categories)).toHaveLength(2);
  expect(opts.categories.test).toEqual(customCat);
});
