import config from '@/lib/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/schema.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    ssl: config.APP_ENV === 'production',
  },
});
