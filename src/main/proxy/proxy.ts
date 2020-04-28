import { IProxySetting } from 'main/proxy/setting';
import { applyWin32 } from 'main/proxy/win';
import os from 'os';

export async function applyProxy(setting: IProxySetting) {
  switch (os.platform()) {
    case 'win32':
      await applyWin32(setting);
    default:
      throw new Error('unsupported OS');
  }
}
