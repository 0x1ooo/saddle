import { M2R, ProxyUICommand, R2M } from '@common/ipc-protocol';
import { ensureDirSync } from '@common/utils/fs';
import { ipcMain, IpcMainEvent } from 'electron';
import log from 'main/log';
import { Disable, Global, IProxySetting, PAC } from 'main/proxy/setting';
import { trojan } from 'main/proxy/trojan';
import { applyWin32, applyWin32Sync } from 'main/proxy/win';
import os from 'os';
import path from 'path';

class ProxyService {
  configDir: string = '';

  activeSetting: IProxySetting = new Disable();

  private _cmdListener: any;

  async initialize() {
    this.configDir = path.join(__dirname, '../config');
    ensureDirSync(this.configDir);
    this._cmdListener = this._onCommand.bind(this);
    ipcMain.on(R2M.PROXY_COMMAND, this._cmdListener);
  }

  async cleanup() {
    ipcMain.off(R2M.PROXY_COMMAND, this._cmdListener);
    this.apply(new Disable());
    await trojan.shutdown();
  }

  async loadSetting(cmd: ProxyUICommand) {
    // TODO: load proxy from config file
    const config = this.configDir;
    log.main().trace('config dir:', config);
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

  async apply(setting: IProxySetting) {
    switch (os.platform()) {
      case 'win32':
        await applyWin32(setting);
        break;
      default:
        throw new Error('unsupported OS');
    }
    this.activeSetting = setting;
  }

  applySync(setting: IProxySetting) {
    switch (os.platform()) {
      case 'win32':
        applyWin32Sync(setting);
        break;
      default:
        throw new Error('unsupported OS');
    }
    this.activeSetting = setting;
  }

  private async _onCommand(event: IpcMainEvent, cmd: ProxyUICommand) {
    trojan.attachUIEvent(event);
    try {
      await this.apply(await this.loadSetting(cmd));
      if (cmd === ProxyUICommand.Disable) {
        await trojan.stop();
      } else {
        await trojan.start();
      }
    } catch (e) {
      await trojan.stop();
      event.reply(M2R.PROXY_ERROR, e);
      trojan.detachUIEvent();
      log.main().error('failed executing proxy command: ', e);
    }
  }
}

export const proxyService = new ProxyService();
