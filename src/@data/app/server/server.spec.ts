import { ProxyType, ServerData } from '@data/app/server/base';
import { ServerManager } from '@data/app/server/manager';
import { TrojanServer } from '@data/app/server/trojan';

const goodTrojanData = {
  meta: {
    type: ProxyType.Trojan,
    id: '12345',
    name: 'test',
    selected: true,
  },
  conf: {
    run_type: 'client',
    local_addr: '0.0.0.0',
    local_port: 1234,
    remote_addr: 'www.xxx.com',
    remote_port: 4321,
  },
} as ServerData;
const badServerData = {
  meta: {
    type: ProxyType.Unknown,
  },
} as ServerData;
const freakServerData = {
  foo: 'bar',
};

let mgr: ServerManager;
beforeEach(() => {
  mgr = new ServerManager();
  mgr.registerBuilder(ProxyType.Trojan, TrojanServer);
});

it('builds a trojan server entry from raw data', () => {
  const testData = JSON.stringify(goodTrojanData);
  const server = mgr.build(testData);
  expect(server instanceof TrojanServer).toBeTruthy();
  expect(server.meta).toEqual(goodTrojanData.meta);
  expect((server as TrojanServer).conf).toEqual(goodTrojanData.conf);
});

it('throws an error when building a server of unknown type', () => {
  const testData = JSON.stringify(badServerData);
  expect(() => mgr.build(testData)).toThrow();
});

it('throws an error when building a server with unknown data structure', () => {
  const testData = JSON.stringify(freakServerData);
  expect(() => mgr.build(testData)).toThrow();
});
