import { ensureDir, fsExist } from '@common/utils/fs';
import { AppConfig, defaultAppConfig, readAppConfig } from '@model/app';
import { ServerConfig } from '@model/app/server';
import { app } from 'electron';
import isDev from 'electron-is-dev';
import fs from 'fs';
import { serverHub } from 'main/hub/server';
import log from 'main/log';
import path from 'path';

const appConfigFilename = 'app.config.json';
const appConfigDir = isDev
  ? path.join(app.getPath('userData'), 'dev')
  : app.getPath('userData');
const appConfigPath = isDev
  ? path.join(appConfigDir, appConfigFilename)
  : path.join(appConfigDir, appConfigFilename);

/** `AppHub` is for manipulating an app config in the runtime.
 *
 * It loads the app config on initialization if a config file is found,
 * or use default settings in new environment. Then it distributes the
 * loaded settings to downstream data hubs such as `ServerHub`.
 *
 * `AppHub` is also a subscriber to downstream data hubs, so to react
 * on inner data changes. It updates and saves the latest config on
 * any data change.
 */
export class AppHub {
  appConfig: AppConfig = defaultAppConfig;

  private _listeners = {
    serversUpdated: this._onServersUpdated.bind(this),
  };

  /** Initialization process tries to
   * - read an app config file, or use default settings if not found.
   * - update the saved config file to persist any new setting provided in new versions as defaults
   * - load data into downstream hubs & register event listeners for downstream data changes
   */
  async initialize() {
    log.main().trace('trying to load app config @', appConfigPath);
    await ensureDir(appConfigDir);
    if (await fsExist(appConfigPath)) {
      try {
        const raw = await new Promise<string>((resolve, reject) => {
          fs.readFile(appConfigPath, 'utf8', (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
        this.appConfig = readAppConfig(raw);
        log.main().debug('loaded config:', this.appConfig);
      } catch (e) {
        log.main().error('invalid app config, using defaults. error:', e);
      }
    } else {
      log.main().debug('app config not found, using defaults');
    }
    serverHub.load(this.appConfig);
    this.save();
    this._register();
  }

  /** Clean up event listeners and occupied resources */
  cleanup() {
    this._unregister();
  }

  /** Loads app config from raw JSON and merges with the current one */
  loadConfig(raw: string) {
    this.appConfig = readAppConfig(raw, this.appConfig);
  }

  /** Persists the app config in a local JSON file */
  async save() {
    try {
      const data = JSON.stringify(this.appConfig, null, 2);
      await new Promise<void>((resolve, reject) => {
        fs.writeFile(appConfigPath, data, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      log.main().debug(`app config is written info ${appConfigPath}`);
    } catch (e) {
      log.main().error('failed writing app config', e);
    }
  }

  private _register() {
    serverHub.on('updated', this._listeners.serversUpdated);
  }

  private _unregister() {
    serverHub.off('updated', this._listeners.serversUpdated);
  }

  private async _onServersUpdated(servers: ServerConfig[]) {
    this.appConfig = {
      ...this.appConfig,
      servers,
    };
    await this.save();
  }
}

/** The singleton of `AppHub` instance */
export const appHub = new AppHub();
