import { LogLevel } from '@common/log';
import { ServerConfig, ServerMeta } from '@model/app/server';
import { defaultSystemConfig, SystemConfig } from '@model/app/system';
import { TrojanLogLevel, TrojanServerConf } from '@model/trojan';
import fs from 'fs';
import assign from 'lodash/assign';
import { TrojanServer } from 'main/datahub/server/trojan';
import { trojanConfigPath } from 'main/proxy/trojan';
import exampleConfig from './trojan.example.client.json';

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

function disposeTmpConf() {
  if (fs.existsSync(trojanConfigPath)) {
    fs.unlinkSync(trojanConfigPath);
  }
}

beforeEach(() => {
  disposeTmpConf();
});

it('apply system config to Trojan format', () => {
  const testSystem = assign({}, defaultSystemConfig, {
    logFilename: 'abc.log',
  } as SystemConfig);
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

it('apply system & server config into Trojan format', async () => {
  const testSystem = assign({}, defaultSystemConfig, {
    localPort: 1234,
    logLevel: LogLevel.Info,
    logFilename: 'abc.log',
    // We ignore the `allowLAN` and `bufferSize` options here,
    // to test if the default system config is merged well.
  } as SystemConfig);
  const testServer = new TrojanServer({
    meta: {} as ServerMeta,
    conf: {
      remote_addr: 'example.com',
      remote_port: 4321,
      password: ['password1', 'password2'],
      ssl: {
        verify: true,
        verify_hostname: true,
        cert: 'test.crt',
        key: 'test.key',
        key_password: '',
        cipher: '',
        cipher_tls13: '',
        curves: '',
        prefer_server_cipher: false,
        sni: '',
        alpn: ['http/1.1', 'h2'],
        session_ticket: true,
        reuse_session: true,
        fingerprint: 'auto',
      },
      tcp: {
        no_delay: true,
        keep_alive: true,
        reuse_port: false,
        prefer_ipv4: false,
        fast_open: false,
        fast_open_qlen: 20,
      },
      mux: {
        enabled: false,
        concurrency: 8,
        idle_timeout: 60,
      },
      router: {
        enabled: false,
        bypass: ['geoip:cn', 'geosite:cn', 'geosite:private'],
        proxy: [],
        block: ['geosite:category-ads'],
        route_by_ip: false,
        route_by_ip_on_nonmatch: false,
        default_policy: 'proxy',
      },
      websocket: {
        enabled: false,
        path: '',
        hostname: '',
        obfuscation_password: '',
        double_tls: true,
      },
    } as TrojanServerConf,
  } as ServerConfig);
  await testServer.apply(testSystem);
  expect(fs.existsSync(trojanConfigPath)).toBeTruthy();
  const appliedConf = JSON.parse(fs.readFileSync(trojanConfigPath, 'utf8'));
  expect(appliedConf).toEqual(exampleConfig);
});
afterEach(async () => {
  disposeTmpConf();
});
