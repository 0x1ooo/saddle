const common = require('./jest.common.config');
module.exports = {
  runner: '@jest-runner/electron',
  testEnvironment: '@jest-runner/electron/environment',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
    ...common.aliases,
  }
};