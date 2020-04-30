import { defaultSystemConfig, SystemConfig } from '@model/app/system';
import { TrojanLogLevel } from '@model/trojan';
import assign from 'lodash/assign';
import { TrojanServer } from 'main/datahub/server/trojan';

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
it('apply system config to Trojan format', () => {
  let conf = TrojanServer.applySysConf(testSystem);
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
  conf = TrojanServer.applySysConf(testSystem);
  expect(conf?.local_addr).toEqual('0.0.0.0');
});
