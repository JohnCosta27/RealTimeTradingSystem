module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: { "ts-jest": { isolatedModules: true } },
  coverageReporters: ["json-summary"],
  testPathIgnorePatterns: ["dist"],
  moduleDirectories: ["node_modules", "src"],
  globalSetup: './src/setup.ts',
};
