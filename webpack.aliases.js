const path = require('path');

function srcPaths(src) {
  return path.join(__dirname, src);
}

module.exports = {
  '@common': srcPaths('src/@common'),
  '@model': srcPaths('src/@model'),
  main: srcPaths('src/main'),
  renderer: srcPaths('src/renderer'),
};