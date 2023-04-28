module.exports = {
  // preset: '@vue/cli-plugin-unit-jest',
  // some says to put it inside package.json
  // testEnvironment: '<rootDir>/tests/firebaseWorkaround.js',
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  modulePaths: [
    '<rootDir>/src',
    '<rootDir>/node_modules',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  collectCoverage: false,
  collectCoverageFrom: ['**/*.{js,vue,ts}', '!**/node_modules/**'],
  setupFiles: ['<rootDir>tests/setupJest.js'],
  snapshotSerializers: ['jest-serializer-vue'],
};
