const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const path = require('path');

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
  plugins: plugins,
  resolve: {
    alias: {
      'main': srcPaths('src/main'),
      'renderer': srcPaths('src/renderer'),
      'react-dom': '@hot-loader/react-dom'
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  }
};