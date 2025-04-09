import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API de Transporte')
    .setDescription('Documentação da API de paradas, linhas e viagens')
    .setVersion('1.0')
    .addTag('stops')
    .addTag('lines')
    .addTag('trips')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();