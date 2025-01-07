import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { CreateApplicationDto } from '@/common/dto/applications';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ErrorHandlingInterceptor } from './common/interceptors/error-handling.interceptor';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  logger.log('Starting application bootstrap...');

  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug'], // Added debug level
    });

    logger.log('Application created, configuring middleware...');

    // Global Pipes & Filters
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

    // CORS
    app.enableCors();

    logger.log('Middleware configured, setting up Swagger...');

    // Swagger Setup
    const config = new DocumentBuilder()
      .setTitle('Research Portal API')
      .setDescription('University of Miami Research Portal API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [CreateApplicationDto],
    });
    SwaggerModule.setup('api', app, document);

    logger.log('Swagger configured, starting server...');

    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    logger.log(`Application is running on ${await app.getUrl()}`);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  logger.error('Unhandled bootstrap error:', error);
  process.exit(1);
});
