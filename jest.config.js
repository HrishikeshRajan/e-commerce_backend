/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose:true,
    collectCoverageFrom:['src/**/*.{ts,js}'],
    coverageThreshold: {
      global: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
    },
    roots: ["./src"],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
      "@routes/(.*)": "<rootDir>/src/routes/$1",
      "@utils/(.*)": "<rootDir>/src/utils/$1",
      "@services/(.*)": "<rootDir>/src/services/$1",
      "@controllers/(.*)": "<rootDir>/src/controllers/$1",
      "@repositories/(.*)":"<rootDir>/src/repository/$1"
    },
    setupFiles: ["dotenv/config"],
    
  };