import { ensureDir, fsExist } from '@common/utils/fs';
import { AppConfig, defaultAppConfig, readAppConfig } from '@model/app';
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

export class AppHub {
  appConfig: AppConfig = defaultAppConfig;

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
  }

  loadConfig(raw: string) {
    this.appConfig = readAppConfig(raw, this.appConfig);
  }

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
}

/** The singleton of `AppHub` instance */
export const appHub = new AppHub();
