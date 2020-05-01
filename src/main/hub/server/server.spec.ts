import { ProxyType, ServerConfig } from '@model/app/server';
import { ServerHub } from 'main/hub/server/server-hub';
import { TrojanServer } from 'main/hub/server/trojan';

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
} as ServerConfig;
const badServerConf = {
  meta: {
    type: ProxyType.Unknown,
  },
} as ServerConfig;
const freakingServerConf = {
  foo: 'bar',
};

let mgr: ServerHub;
beforeEach(() => {
  mgr = new ServerHub();
  mgr.registerBuilder(ProxyType.Trojan, TrojanServer);
});

it('builds a trojan server entry from raw data', () => {
  const server = mgr.build(goodTrojanData);
  expect(server).toBeTruthy();
  expect(server instanceof TrojanServer).toBeTruthy();
  expect(server!.meta).toEqual(goodTrojanData.meta);
  expect((server as TrojanServer).conf).toEqual(goodTrojanData.conf);
});

it('throws an error when building a server of unknown type', () => {
  expect(mgr.build(badServerConf)).toBeNull();
});

it('throws an error when building a server with unknown data structure', () => {
  expect(mgr.build(freakingServerConf as any)).toBeNull();
});
