import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailController } from './email.controller';
@Module({
  controllers: [EmailController],
  providers: [EmailService],
  imports: [
    /*MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          SES: new AWS.SES({
            region: 'us-east-1',
            accessKeyId: 'AKIA4GHCIAFVG5YMHQWT',
            secretAccessKey: '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'
          }),
        },
        defaults: {
          from: '"MAYRON" mayronfernades01@gmail.com',
        }
      }),
    }),*/
  ],
  exports: [EmailService],
})
export class EmailModule {}
