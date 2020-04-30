import { TrojanServer } from '@data/app/server/trojan';
import { defaultSystemConfig, SystemConfig } from '@data/app/system';
import { TrojanLogLevel } from '@data/trojan';
import { assign } from 'lodash';

// const testMeta = {
//   id: '111',
//   name: 'test',
//   type: ProxyType.Trojan,
// } as ServerMeta;
// const testEssential = {
//   remote_addr: '',
//   remote_port: 0,
//   password: ['1', '2'],
// };
let testSystem: SystemConfig;

beforeEach(() => {
  testSystem = assign(defaultSystemConfig, {
    logFilename: 'abc.log',
  } as SystemConfig);
});
it('converts sysconf to Trojan format', () => {
  let conf = TrojanServer.convertSysConf(testSystem);
  expect(conf).toBeTruthy();
  expect(conf).toEqual({
    run_type: 'client',
    local_addr: '127.0.0.1',
    local_port: 7890,
    log_level: TrojanLogLevel.Warning,
    log_file: 'abc.log',
    buffer_size: 512,
  });

  // Test allow LAN
  testSystem.allowLAN = true;
  conf = TrojanServer.convertSysConf(testSystem);
  expect(conf?.local_addr).toEqual('0.0.0.0');
});
