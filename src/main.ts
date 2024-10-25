import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';  // Import express to configure middleware

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json({ limit: '50mb' }));  // Set JSON payload limit
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));  // Set URL-encoded payload limit

  const config = new DocumentBuilder()
      .setTitle('Simple Blog')
      .setDescription('The Simple Blog API documentation')
      .setVersion('1.0')
      .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();  // Ensure CORS is enabled

  await app.listen(3000);
}
bootstrap();
