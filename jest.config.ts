
import { Config } from "jest";


const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testPathIgnorePatterns: ['./coverage', './dist', './logs', './node_modules', './.vscode'],
  resetMocks: true,
  clearMocks: true
}

export default config;