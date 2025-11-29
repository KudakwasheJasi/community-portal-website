import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';

  if (isProduction) {
    return {
      type: 'postgres',
      url: configService.get('DATABASE_URL'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false, // Should be false in production
      ssl: {
        rejectUnauthorized: false, // For production, you might want to configure this properly
      },
    };
  } else {
    return {
      type: 'better-sqlite3',
      database: configService.get('DB_DATABASE', './database.sqlite'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // Only for development
      logging: true, // Only for development
    };
  }
};
