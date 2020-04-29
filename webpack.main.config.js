const path = require('path');
const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
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
    ...plugins,
    new CopyWebpackPlugin([{
      from: path.join(__dirname, 'vendor/**'),
      to: path.join(__dirname, '.webpack/main'),
      context: path.join(__dirname, 'vendor'),
    }]),
    ...['icon'].map(subdir => new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'assets', subdir),
      to: path.resolve(__dirname, '.webpack/main', subdir),
    }])),
  ],
  resolve: {
    alias: {
      '@common': srcPaths('src/@common'),
      'main': srcPaths('src/main'),
      'renderer': srcPaths('src/renderer'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
};