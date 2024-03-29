const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function srcPaths(src) {
  return path.join(__dirname, src);
}

rules.push({
  test: /\.css$/,
  use: [{
    loader: 'style-loader'
  }, {
    loader: 'css-loader'
  }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    ...['img'].map(subdir => new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'assets', subdir),
      to: path.resolve(__dirname, '.webpack/renderer', subdir),
    }])),
  ],
  resolve: {
    alias: {
      '@common': srcPaths('src/@common'),
      'main': srcPaths('src/main'),
      'renderer': srcPaths('src/renderer'),
      'react-dom': '@hot-loader/react-dom'
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  }
};