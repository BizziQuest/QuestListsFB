module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  // some says to put it inside package.json
  // testEnvironment: '<rootDir>/tests/firebaseWorkaround.js',
  moduleFileExtensions: ['js', 'json', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  modulePaths: [
    '<rootDir>/src',
    '<rootDir>/node_modules',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': 'vue-jest',
  },
  collectCoverage: false,
  collectCoverageFrom: ['**/*.{js,vue}', '!**/node_modules/**'],
  setupFiles: ['<rootDir>tests/setupJest.js'],
  snapshotSerializers: ['jest-serializer-vue'],
};
