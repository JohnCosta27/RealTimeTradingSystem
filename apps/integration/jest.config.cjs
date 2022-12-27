module.exports = {
  preset: "ts-jest",
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: "node",
  testTimeout: 2000,
  coverageReporters: ["json-summary"],
  testPathIgnorePatterns: ["dist"],
  moduleDirectories: ["node_modules", "src"],
};
