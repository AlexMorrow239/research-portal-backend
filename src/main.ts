/**
 * Bootstrap file for the Research Engine API
 * Configures and initializes the NestJS application with necessary middleware,
 * validation pipes, Swagger documentation, and error handling.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { CreateApplicationDto } from '@/common/dto/applications';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ErrorHandlingInterceptor } from './common/interceptors/error-handling.interceptor';

const logger = new Logger('Bootstrap');

/**
 * Bootstrap the NestJS application with all necessary configurations
 * @throws {Error} If application fails to start
 */
async function bootstrap() {
  logger.log('Starting application bootstrap...');

  try {
    // Initialize NestJS application with detailed logging
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug'],
    });

    logger.log('Application created, configuring middleware...');

    // Configure global middleware
    configureGlobalMiddleware(app);

    // Enable CORS for cross-origin requests
    app.enableCors();

    logger.log('Middleware configured, setting up Swagger...');

    // Configure and setup Swagger documentation
    setupSwagger(app);

    logger.log('Swagger configured, starting server...');

    // Start the server on specified port
    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    logger.log(`Application is running on ${await app.getUrl()}`);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

/**
 * Configure global middleware for the application
 * @param app NestJS application instance
 */
function configureGlobalMiddleware(app: any) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new ErrorHandlingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
}

/**
 * Setup Swagger documentation
 * @param app NestJS application instance
 */
function setupSwagger(app: any) {
  const config = new DocumentBuilder()
    .setTitle('Research Engine API')
    .setDescription('University of Miami Research Engine API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [CreateApplicationDto],
  });
  SwaggerModule.setup('api', app, document);
}

// Handle unhandled bootstrap errors
bootstrap().catch((error) => {
  logger.error('Unhandled bootstrap error:', error);
  process.exit(1);
});
