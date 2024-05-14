import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailTemplates } from 'src/templates/email';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(destination: string, subject: string, mensagem: string) {
    await this.mailerService.sendMail({
      to: destination,
      subject,
      text: mensagem,
    });
  }
  async sendEmailFromTemplate(
    destination: string,
    subject: string,
    template: keyof typeof EmailTemplates,
    data?: any,
  ) {
    await this.mailerService.sendMail({
      to: destination,
      subject,
      template: `./${template}`,
      context: data,
      html: EmailTemplates[template](data)
    });
  }
}
