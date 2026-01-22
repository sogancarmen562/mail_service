import { Module } from '@nestjs/common';
import MailController from './mail.controller';
import SendMailService from 'src/application/use-cases/sendMail.usecase';
import SendMailNodeMailerService from 'src/infrastructure/services/smtp/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from 'src/infrastructure/services/cloudinary/cloudinary.service';
import { MulterModule } from '@nestjs/platform-express';
import Constante from 'src/constante';

@Module({
imports: [
    ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env',
    }),
    MulterModule.register({
      limits: { fileSize: Constante.MAXIMUM_SIZE_OF_FILE },
    }),
    MailerModule.forRoot({
    transport: {
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),],
  controllers: [MailController],
  providers: [SendMailService, SendMailNodeMailerService, CloudinaryService],
})

export class MailModule {}