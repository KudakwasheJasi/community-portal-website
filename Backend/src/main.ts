import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
  const frontendUrl =
    configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

  // Enable CORS
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://community-portal-website.onrender.com',
    'https://client-r02b6gz9x-kudakwashejasis-projects.vercel.app'
  ];
  
  app.enableCors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Content-Range,X-Content-Range'
  });

  // Set global prefix before Swagger setup
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Community Portal API')
    .setDescription('API documentation for Community Portal')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  const apiUrl = nodeEnv === 'production'
    ? `https://community-portal-website.onrender.com/api`
    : `http://localhost:${port}/api`;

  console.log(`🚀 Application is running on port: ${port} in ${nodeEnv} mode`);
  console.log(`🌐 Frontend URL: ${frontendUrl}`);
  console.log(`📚 API Documentation: ${apiUrl}`);
  
  // Log all environment variables (for debugging, remove in production)
  console.log('Environment Variables:', {
    NODE_ENV: configService.get('NODE_ENV'),
    PORT: configService.get('PORT'),
    FRONTEND_URL: configService.get('FRONTEND_URL')
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
