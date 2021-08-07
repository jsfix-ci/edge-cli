module.exports = {
  roots: ['test', 'src'],
  testTimeout: 30000,
  testPathIgnorePatterns: [
    "/node_modules/",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
};
