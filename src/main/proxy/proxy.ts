import { M2R, ProxyUICommand, R2M } from '@common/ipc-protocol';
import { fsExist } from '@common/utils/promise';
import { ipcMain, IpcMainEvent } from 'electron';
import fs from 'fs';
import { Disable, Global, IProxySetting, PAC } from 'main/proxy/setting';
import { applyWin32, applyWin32Sync } from 'main/proxy/win';
import { trojan } from 'main/trojan';
import os from 'os';
import path from 'path';

class ProxyService {
  configDir: string = '';

  activeSetting: IProxySetting = new Disable();

  private _cmdListener: any;

  async initialize() {
    this.configDir = path.join(__dirname, '../config');
    const dirFound = await fsExist(this.configDir);
    if (!dirFound) {
      await new Promise<void>((resolve, reject) =>
        fs.mkdir(this.configDir, { recursive: true }, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        })
      );
    }
    this._cmdListener = this._onCommand.bind(this);
    ipcMain.on(R2M.PROXY_COMMAND, this._cmdListener);
  }

  dispose() {
    ipcMain.off(R2M.PROXY_COMMAND, this._cmdListener);
    this.applySync(new Disable());
    trojan.dispose();
  }

  async loadSetting(cmd: ProxyUICommand) {
    // TODO: load proxy from config file
    const config = this.configDir;
    console.log('config dir:', config);
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
    trojan.attachUI(event);
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
      trojan.detachUI();
      console.error('failed executing proxy command: ', e);
    }
  }
}

export const proxyService = new ProxyService();
