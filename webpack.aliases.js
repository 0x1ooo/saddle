const path = require('path');

function srcPaths(src) {
  return path.join(__dirname, src);
}

module.exports = {
  '@common': srcPaths('src/@common'),
  conf: srcPaths('src/conf'),
  main: srcPaths('src/main'),
  renderer: srcPaths('src/renderer'),
};