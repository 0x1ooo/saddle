import { fsExist } from '@common/utils/fs';
import { spawn } from 'child_process';
import fs from 'fs';
import logger from 'main/log';
import { IProxySetting } from 'main/proxy/setting';
import path from 'path';

const SYSPROXY_PATH = path.join(__dirname, 'win32/sysproxy.exe');

export async function applyWin32(setting: IProxySetting): Promise<void> {
  const exeFound = await fsExist(SYSPROXY_PATH);
  if (!exeFound) {
    throw new Error(`dependency not found: ${SYSPROXY_PATH}`);
  }

  return new Promise<void>((resolve, reject) => {
    const proc = spawn(SYSPROXY_PATH, setting.win32Args, {
      windowsHide: true,
    });
    proc.stdout.on('data', logger.service.info);
    proc.stderr.on('data', logger.service.warn);
    proc.on('close', (code) => {
      if (!code) {
        resolve();
      } else {
        reject(code);
      }
    });
  });
}

/** Apply the proxy setting on Windows synchronously.
 * This function is for disposing the proxy service,
 * such as on the process's exit signle where the event
 * loop will be terminated forcely and won't wait for
 * any callback.
 */
export function applyWin32Sync(setting: IProxySetting): void {
  if (!fs.existsSync(SYSPROXY_PATH)) {
    throw new Error(`dependency not found: ${SYSPROXY_PATH}`);
  }
  spawn(SYSPROXY_PATH, setting.win32Args, {
    detached: true,
    windowsHide: true,
  });
}
