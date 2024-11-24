module.exports = {
  testMatch: ['**/*.test.jsx'], // Update if necessary to match your test files
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",  // Use babel-jest to transpile JS and JSX files
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
