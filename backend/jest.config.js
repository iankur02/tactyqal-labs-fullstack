module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/setup-env.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 20_000,
  verbose: true,
  collectCoverageFrom: ['src/**/*.js', '!src/seed/**', '!server.js'],
};