import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { env } from 'src/constants/env';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
@Module({
  providers: [EmailService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: env.EMAIL_HOST,
          port: parseInt(env.EMAIL_PORT || '465'),
          secure: env.EMAIL_SECURE === 'true',
          auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASSWORD,
          },
        },
        defaults: {
          from: 'Reserva99 <mayron.g.fernandes@gmail.com>',
        },
        template: {
          dir: join(process.cwd(), 'dist/templates/email'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  exports: [EmailService],
})
export class EmailModule {}
