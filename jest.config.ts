const config = {
  // Specifies that Jest should use ts-jest, a TypeScript preprocessor for Jest
  preset: "ts-jest",

  // Defines the environment in which the tests will run
  // "node" means tests will execute in a Node.js environment
  testEnvironment: "node",

  // Enables verbose output, displaying individual test results with details
  verbose: true,

  // Enables Jest's built-in coverage collection feature
  collectCoverage: true,

  // Specifies which files should be included when calculating code coverage
  // Here, it includes all TypeScript files inside the "controllers" directory
  collectCoverageFrom: ["<rootDir>/controllers/**/*.ts"],

  // Specifies the pattern to find test files
  // Looks for test files with the `.test.ts` extension inside the "test/controllers" directory
  testMatch: ["<rootDir>/test/controllers/**/*.test.ts"],

  // Configures Jest to transform TypeScript files using ts-jest
  // Ensures Jest uses the specified TypeScript configuration file
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },

  // Fixes module resolution for JavaScript files that might be imported in TypeScript
  // Ensures that relative imports (e.g., `import ... from "./file.js"`) work correctly
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;
