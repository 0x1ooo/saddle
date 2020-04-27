import isDev from 'electron-is-dev';
import path from 'path';

export default function asset(filename: string): string {
  if (!filename) {
    return filename;
  }

  if (!path.isAbsolute(filename)) {
    throw new Error(`asset filename must be absolute to root path, for example:
  "/img/logo.svg"
    `);
  }
  return isDev ? filename : path.resolve(__dirname, '..', path.relative('/', filename));
}
