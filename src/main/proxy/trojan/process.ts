import { M2R, ProxyCode, ProxyError } from '@common/ipc-protocol';
import { fsExist } from '@common/utils/fs';
import { waitUntil } from '@common/utils/promise';
import { ChildProcess, spawn } from 'child_process';
import { app, IpcMainEvent } from 'electron';
import isDev from 'electron-is-dev';
import log from 'main/log';
import os from 'os';
import path from 'path';

const trojanBasePath = path.join(__dirname, 'trojan');
const trojanExecs: { [platform: string]: string } = {
  win32: 'trojan-go.exe',
};
const trojanConfigFilename = 'client.json';

/** The config file's path that Trojan reads to launch its client service */
export const trojanConfigPath = isDev
  ? path.join(__dirname, trojanConfigFilename)
  : path.join(app.getPath('userData'), trojanConfigFilename);

interface TrojanArgs {
  entry: string;
  config: string;
}

class TrojanService {
  private _uiEvent: IpcMainEvent | null = null;

  private _proc: ChildProcess | null = null;

  /** Attaches an `IpcMainEvent` instance to the service, so to
   * broadcast the service's status later.
   */
  attachUIEvent(event: IpcMainEvent) {
    this._uiEvent = event;
  }

  /** Detaches an `IpcMainEvent` to stop broadcasting the service's status. */
  detachUIEvent() {
    this._uiEvent = null;
  }

  /** Checks if the underlying Trojan client is still running. */
  get alive() {
    return this._proc && !this._proc.killed;
  }

  /** Starts the underlying Trojan client and establishes
   * the port listener, stdio pipes, etc. Also notify the
   * attached UI if any.
   */
  async start() {
    this._notify(M2R.PROXY_BUSY);
    await this._stop();
    const { entry, config } = getTrojanPath();
    const entryFound = await fsExist(entry);
    if (!entryFound) {
      throw new ProxyError(
        ProxyCode.TrojanNotFound,
        `Trojan not found at ${entry}`
      );
    }
    const proc = spawn(entry, ['-config', config], { windowsHide: true });
    if (!proc) {
      throw new ProxyError(
        ProxyCode.TrojanNotSpawned,
        `Trojan process not spawned`
      );
    }

    proc.stdout.on('data', TrojanService._onStdOut.bind(this));
    proc.stderr.on('data', TrojanService._onStdErr.bind(this));
    proc.on('close', this._onClose.bind(this));
    proc.on('error', this._onError.bind(this));
    this._proc = proc;

    // Ensure trojan-go has finished the startup process and not terminated on error
    setTimeout(() => {
      if (this.alive) {
        this._notify(M2R.PROXY_ENABLED);
      }
    }, 500);
  }

  /** Stops listening to any incoming traffics, and notify the attached UI. */
  async stop() {
    this._notify(M2R.PROXY_BUSY);
    await this._stop();
    this._notify(M2R.PROXY_DISABLED);
  }

  /** Shuts down the service completely
   * and clean up any occupied resources.
   */
  async shutdown() {
    this.detachUIEvent();
    await this._stop();
  }

  private async _stop() {
    if (this.alive) {
      this._proc!.kill();
      await this._waitClose();
    }
  }

  private async _waitClose() {
    await waitUntil(() => !this._proc, 100, 10000);
  }

  /** Notify a Trojan status to the UI process if exists.
   * Automatically detaches any obsoleted UI event.
   * @param m2r An IPC Message of M2R.*
   * @param args Additional data to be intepreted by the renderer process listener
   */
  private _notify(m2r: string, ...args: any[]) {
    if (
      this._uiEvent &&
      this._uiEvent.sender &&
      !this._uiEvent.sender.isDestroyed
    ) {
      this._uiEvent.reply(m2r, ...args);
    } else {
      this.detachUIEvent();
    }
  }

  // / ------------ Trojan process event handlers ------------ ///

  private static _onStdOut(data: Buffer) {
    data
      .toString()
      .split('\n')
      .forEach((line) => {
        if (line.trim()) {
          log.trojan().debug(line);
        }
      });
  }

  private static _onStdErr(data: Buffer) {
    data
      .toString()
      .split('\n')
      .forEach((line) => {
        if (line.trim()) {
          log.trojan().error(line);
        }
      });
  }

  private _onClose(code: number | null) {
    log.trojan().debug(`exit code ${code == null ? 0 : code}`);
    this._proc = null;
    if (code) {
      this._notify(
        M2R.PROXY_ERROR,
        new ProxyError(ProxyCode.TrojanInternalError, `exit code ${code}`)
      );
    }
  }

  private async _onError(err: Error) {
    log.trojan().error(err);
    await this.stop();
    this._proc = null;
    this._notify(
      M2R.PROXY_ERROR,
      new ProxyError(ProxyCode.TrojanInternalError, err.message)
    );
  }
}

function getTrojanPath(): TrojanArgs {
  const filename = trojanExecs[os.platform()];
  if (!filename) {
    throw new Error(`Saddle doesn't support this system currently.`);
  }
  return {
    entry: path.join(trojanBasePath, filename),
    config: trojanConfigPath,
  };
}

/** The singleton of `TrojanService` that interacts with
 * the underlying Trojan-go client.
 */
export const trojan = new TrojanService();
