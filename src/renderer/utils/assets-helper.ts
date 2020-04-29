import isDev from 'electron-is-dev';
import path from 'path';

/** Used for converting an absolute asset path to
 * a runtime path.
 *
 * @param absolutePath The absolute asset path, e.g. `/img/logo.svg`
 * @returns The actual path to the requesting asset depending on runtime environment.
 * @throws When `absolutePath` is not absolute.
 */
export function asset(absolutePath: string): string {
  if (!absolutePath) {
    return absolutePath;
  }

  if (!path.isAbsolute(absolutePath)) {
    throw new Error(`asset filename must be absolute to root path, for example:
  "/img/logo.svg"
    `);
  }
  return isDev
    ? absolutePath
    : path.resolve(__dirname, '..', path.relative('/', absolutePath));
}
