import { trojan } from './process';

export { trojan } from './process';
export async function cleanupTrojanService() {
  console.log('cleaning up trojan...');
  await trojan.stop();
}
