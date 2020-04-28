import { ProxyUICommand, R2M } from '@common/ipc-protocol';
import { ipcMain } from 'electron';
import { Disable, Global, IProxySetting, PAC } from 'main/proxy/setting';
import { applyWin32 } from 'main/proxy/win';
import { cleanupTrojanService, trojan } from 'main/trojan';
import os from 'os';

export async function initProxy() {
  ipcMain.on(R2M.START_PROXY, async (event, cmd: ProxyUICommand) => {
    trojan.registerEvent(event);
    try {
      await applyProxy(await loadProxyConfig(cmd));
    } catch (e) {
      trojan.clearEvent();
      console.error('start proxy failed: ', e);
    }
  });
  ipcMain.on(R2M.STOP_PROXY, async (event) => {
    trojan.registerEvent(event);
    try {
      await applyProxy(new Disable());
    } catch (e) {
      console.error('stop proxy failed: ', e);
    } finally {
      trojan.clearEvent();
    }
  });
}

export async function cleanupProxy() {
  await applyProxy(new Disable());
  await cleanupTrojanService();
}

async function loadProxyConfig(cmd: ProxyUICommand): Promise<IProxySetting> {
  // TODO: load proxy from config file
  switch (cmd) {
    case ProxyUICommand.Disable:
      return new Disable();
    case ProxyUICommand.Global:
      return new Global('127.0.0.1', 7890, ['localhost', '192.168.*']);
    case ProxyUICommand.PAC:
      return new PAC('http://127.0.0.1:7891/pac/?t=165700');
    default:
      throw new Error('unknown proxy command');
  }
}

async function applyProxy(setting: IProxySetting) {
  console.log('applying proxy', setting);
  switch (os.platform()) {
    case 'win32':
      await applyWin32(setting);
      break;
    default:
      throw new Error('unsupported OS');
  }
  if (setting instanceof Disable) {
    await trojan.stop();
  } else {
    await trojan.start();
  }
}
