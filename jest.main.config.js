const common = require('./jest.common.config');
module.exports = {
  runner: '@jest-runner/electron/main',
  testEnvironment: 'node',
  moduleNameMapper: {
    ...common.aliases
  }
};