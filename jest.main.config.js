module.exports = {
  runner: '@jest-runner/electron/main',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@common/(.*)': '<rootDir>/src/@common/$1',
    'main/(.*)': '<rootDir>/src/main/$1',
    'renderer/(.*)': '<rootDir>/src/renderer/$1',
  }
};