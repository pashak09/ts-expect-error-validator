const config = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'js'],
  testRegex: '^.+Spec\\.ts$',
  clearMocks: true,
  restoreMocks: true,
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
};

module.exports = config;
