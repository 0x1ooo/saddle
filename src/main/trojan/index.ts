import { R2M } from '@common/ipc-protocol';
import { ipcMain } from 'electron';
import { trojan } from './process';

export async function initTrojanService() {
  ipcMain.on(R2M.START_TROJAN, async (event) => {
    trojan.registerEvent(event);
    try {
      await trojan.start();
    } catch (e) {
      trojan.clearEvent();
    }
  });
  ipcMain.on(R2M.STOP_TROJAN, async (event) => {
    trojan.registerEvent(event);
    try {
      await trojan.stop();
    } catch (e) {
      trojan.clearEvent();
    }
  });
}
export async function cleanupTrojanService() {
  console.log('cleaning up trojan...');
  await trojan.stop();
}

export * from './process';
