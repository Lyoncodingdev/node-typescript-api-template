/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  setupFiles: ['./jest.setup.ts'],
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
};