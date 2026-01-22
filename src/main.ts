import { NestFactory } from '@nestjs/core';
import { MailModule } from './presentation/mail.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(MailModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, 
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('SendMail API')
    .setDescription('Documentation of SendMail API')
    .setVersion('1.0')
    .addApiKey(
      {
        type: "apiKey",
        name: "x-api-key",
        in: "header",
        description: "Enter your API key"
      },
      "apiKey"
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : [];
  
  app.enableCors({
      origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    }
  )

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();