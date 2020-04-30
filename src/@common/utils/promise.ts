export async function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, ms)
  );
}

export async function waitUntil(
  predicate: () => boolean,
  interval: number,
  timeout: number
) {
  return new Promise((resolve, reject) => {
    let refTimer: number;
    let refTimeout: number;
    const dispose = () => {
      clearInterval(refTimer);
      clearTimeout(refTimeout);
    };
    const work = () => {
      let result;
      try {
        result = predicate();
        if (result) {
          dispose();
          resolve(result);
        } else {
          refTimer = setTimeout(work, interval);
        }
      } catch (e) {
        dispose();
        reject(e);
      }
    };
    refTimer = setTimeout(work, interval);
    refTimeout = setTimeout(() => {
      dispose();
      reject(
        new Error(`Timed out on waiting (${(timeout / 1000).toFixed(2)}s).`)
      );
    }, timeout);
  });
}
