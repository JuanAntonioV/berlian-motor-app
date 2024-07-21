import { loadEnvFile } from 'process';

const projectDir = process.cwd();

loadEnvFile(projectDir + '/.env.local');

const config = {
  APP_ENV: process.env.APP_ENV || 'development',
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DB_NAME: process.env.DB_NAME || 'postgres',
  DB_SEED:
    process.env.APP_ENV === 'development' && process.env.DB_SEED === 'true',
  AUTH_SECRET: process.env.AUTH_SECRET,
};

export default config;
