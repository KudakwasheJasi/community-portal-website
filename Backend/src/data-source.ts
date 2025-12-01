import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.development' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false, // Never use synchronize in production
  logging: process.env.DB_LOGGING === 'true',
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  connectTimeoutMS: 60000, // 60 second timeout
});
