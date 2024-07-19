import { loadEnvFile } from 'process';

const projectDir = process.cwd();

loadEnvFile(projectDir);

const config = {
  APP_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
};

export default config;
