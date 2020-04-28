import { spawn } from 'child_process';
import fs from 'fs';
import { IProxySetting } from 'main/proxy/setting';
import path from 'path';

const SYSPROXY_PATH = path.join(__dirname, 'win32/sysproxy.exe');

export async function applyWin32(setting: IProxySetting): Promise<void> {
  const exeFound = await new Promise<boolean>((resolve) =>
    fs.exists(SYSPROXY_PATH, resolve)
  );
  if (!exeFound) {
    throw new Error(`dependency not found: ${SYSPROXY_PATH}`);
  }

  return new Promise<void>((resolve, reject) => {
    const proc = spawn(SYSPROXY_PATH, setting.win32Args, {
      windowsHide: true,
    });
    proc.stdout.on('data', console.log);
    proc.stderr.on('data', console.error);
    proc.on('close', (code) => {
      if (!code) {
        resolve();
      } else {
        reject(code);
      }
    });
  });
}
