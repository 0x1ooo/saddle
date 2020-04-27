const path = require('path');
const rules = require('./webpack.rules');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function srcPaths(src) {
  return path.join(__dirname, src);
}

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/main.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [
    ...this.plugins,
    new CopyWebpackPlugin([{
      from: path.join(__dirname, 'vendor/**'),
      to: path.join(__dirname, '.webpack/main'),
      context: path.join(__dirname, 'vendor'),
    }]),
  ],
  resolve: {
    alias: {
      '@main': srcPaths('src/main'),
      '@renderer': srcPaths('src/renderer'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
};