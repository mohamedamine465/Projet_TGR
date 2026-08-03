export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^#config/(.*)$': '<rootDir>/src/config/$1',
    '^#middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^#shared/(.*)$': '<rootDir>/src/shared/$1'
  },
  globalSetup: '<rootDir>/tests/global-setup.js',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
