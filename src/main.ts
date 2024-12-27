import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'], // Only show errors and warnings
  });
  // const app = await NestFactory.create(AppModule)
  // Global Pipes & Filters
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS
  app.enableCors();

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Research Portal API')
    .setDescription('University of Miami Research Portal API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Log all registered routes
  // const server = app.getHttpServer();
  // const router = server._events.request._router;
  // console.log('Registered Routes:');
  // router.stack.forEach(layer => {
  //   if (layer.route) {
  //     console.log(`${layer.route.stack[0].method.toUpperCase()} ${layer.route.path}`);
  //   }
  // });

  await app.listen(process.env.PORT ?? 3000);

  Logger.log('Application is starting...');
  Logger.log(`Application running on ${await app.getUrl()}`);
}
bootstrap();
