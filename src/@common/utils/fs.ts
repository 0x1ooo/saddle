import fs from 'fs';

export async function fsExist(path: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => fs.exists(path, resolve));
}

export function ensureDirSync(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export async function ensureDir(dir: string) {
  const dirFound = await fsExist(dir);
  if (!dirFound) {
    await new Promise<void>((resolve, reject) =>
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    );
  }
}
