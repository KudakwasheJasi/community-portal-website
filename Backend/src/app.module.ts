import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import configuration from './config/configuration.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const isPostgres = configService.get('DB_TYPE') === 'postgres';
        
        if (isPostgres) {
          return {
            type: 'postgres',
            url: configService.get('DATABASE_URL'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: configService.get('DB_SYNCHRONIZE', configService.get('NODE_ENV') !== 'production'),
            logging: configService.get('DB_LOGGING', configService.get('NODE_ENV') === 'development'),
            ssl: { rejectUnauthorized: false }
          } as TypeOrmModuleOptions;
        } else {
          return {
            type: 'better-sqlite3',
            database: configService.get('DB_DATABASE', './database.sqlite'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: configService.get('DB_SYNCHRONIZE', configService.get('NODE_ENV') !== 'production'),
            logging: configService.get('DB_LOGGING', configService.get('NODE_ENV') === 'development'),
          } as TypeOrmModuleOptions;
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}