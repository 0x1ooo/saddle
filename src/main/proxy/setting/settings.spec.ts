import { Disable, Global } from '.';
import { PAC } from './pac';

const MOCKS = {
  host: '1.1.1.1',
  port: 1234,
  noProxy: ['a', 'b', 'c'],
  pac: 'http://1.1.1.1:1234/pac',
};

test('GLOBAL proxy gives win32 args', () => {
  let global = new Global(MOCKS.host, MOCKS.port);
  expect(global.win32Args).toEqual(['global', `${MOCKS.host}:${MOCKS.port}`]);
  global = new Global(MOCKS.host, MOCKS.port, MOCKS.noProxy);
  expect(global.win32Args).toEqual([
    'global',
    `${MOCKS.host}:${MOCKS.port}`,
    MOCKS.noProxy.join(';'),
  ]);
});
test('PAC proxy gives win32 args', () => {
  const pac = new PAC(MOCKS.pac);
  expect(pac.win32Args).toEqual(['pac', MOCKS.pac]);
});

test('OFF proxy gives win32 args', () => {
  const disable = new Disable();
  expect(disable.win32Args).toEqual(['off']);
});
