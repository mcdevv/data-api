import dotenv from 'dotenv';
// there exists some concensus around using settings.js or config.js
// enables exportable env vars: import { testEnvironmentVariable } from '../settings';
dotenv.config();
export const testEnvironmentVariable = process.env.TEST_ENV_VARIABLE;
export const connectionString = process.env.CONNECTION_STRING;
