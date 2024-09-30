import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const enableSwaggerConfig = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Cobuccio')
    .setDescription('Fazendo um desafio :)')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};
