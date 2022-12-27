module.exports = {
  preset: "ts-jest",
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: "node",
  coverageReporters: ["json-summary"],
  testPathIgnorePatterns: ["dist"],
  moduleDirectories: ["node_modules", "src"],
};
