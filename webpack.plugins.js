const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  ...['img'].map(subdir => new CopyWebpackPlugin([{
    from: path.resolve(__dirname, 'assets', subdir),
    to: path.resolve(__dirname, '.webpack/renderer', subdir),
  }]))
];