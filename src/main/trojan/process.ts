import { ChildProcess, spawn } from 'child_process';
import { IpcMainEvent } from 'electron';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { M2R, TrojanErrCode, TrojanError } from '../@common/ipc-protocol';

const TROJAN_BASE_PATH = path.join(__dirname, 'trojan');
const TROJAN_EXECS: { [platform: string]: string } = {
  win32: 'trojan-go.exe',
};
const TROJAN_CONFIG_PATH = 'client.json';

interface TrojanArgs {
  entry: string;
  config: string;
}

class TrojanService {
  private _uiEvent: IpcMainEvent | null = null;

  private _proc: ChildProcess | null = null;

  registerEvent(event: IpcMainEvent) {
    this._uiEvent = event;
  }

  clearEvent() {
    this._uiEvent = null;
  }

  get alive() {
    return this._proc && !this._proc.killed;
  }

  async start() {
    try {
      this._notify(M2R.TROJAN_BUSY);
      await this.stop(true);
      const { entry, config } = getTrojanPath();
      const entryFound = await new Promise<boolean>((resolve) =>
        fs.exists(entry, resolve)
      );
      if (!entryFound) {
        throw new TrojanError(
          TrojanErrCode.ExecNotFound,
          `Trojan not found at ${entry}`
        );
      }
      const proc = spawn(entry, ['-config', config], { windowsHide: true });
      if (!proc) {
        throw new Error(`Trojan process not spawned`);
      }

      proc.stdout.on('data', TrojanService._onStdOut.bind(this));
      proc.stderr.on('data', TrojanService._onStdErr.bind(this));
      proc.on('close', this._onClose.bind(this));
      proc.on('error', this._onError.bind(this));
      this._proc = proc;

      // Wait trojan-go to finish the startup process
      setTimeout(() => {
        if (this.alive) {
          this._notify(M2R.TROJAN_STARTED);
        }
      }, 1000);
    } catch (e) {
      console.error(`<trojan err>`, e);
      this._notify(M2R.TROJAN_ERROR, e);
      this.stop(true);
      throw e;
    }
  }

  async stop(silent = false) {
    if (!silent) {
      this._notify(M2R.TROJAN_BUSY);
    }
    if (this.alive) {
      this._proc!.kill();
      this._proc = null;
    }
    if (!silent) {
      this._notify(M2R.TROJAN_STOPPED);
    }
  }

  private _notify(msg: string, args?: any) {
    if (this._uiEvent) {
      this._uiEvent.reply(msg, args);
    }
  }

  // // Trojan process event handlers ////
  private static _onStdOut(data: any) {
    console.log(`[trojan] ${data}`);
  }

  private static _onStdErr(data: any) {
    console.error(`[trojan] ${data}`);
  }

  private _onClose(code: number | null) {
    console.log(`<trojan exit> code ${code}`);
    this._proc = null;
    if (code) {
      this._notify(
        M2R.TROJAN_ERROR,
        new TrojanError(TrojanErrCode.InternalError, `exit code ${code}`)
      );
    }
  }

  private async _onError(err: Error) {
    console.error(`<trojan err>`, err);
    await this.stop();
    this._proc = null;
    this._notify(
      M2R.TROJAN_ERROR,
      new TrojanError(TrojanErrCode.InternalError, err.message)
    );
  }
}

export const trojan = new TrojanService();

function getTrojanPath(): TrojanArgs {
  const filename = TROJAN_EXECS[os.platform()];
  if (!filename) {
    throw new Error(`Saddle doesn't support this system currently.`);
  }
  return {
    entry: path.join(TROJAN_BASE_PATH, filename),
    config: path.join(TROJAN_BASE_PATH, TROJAN_CONFIG_PATH),
  };
}
