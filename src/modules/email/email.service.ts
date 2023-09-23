import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  // constructor(private mailerService: MailerService) {}

  async enviarEmail(destination: string, subject: string, mensagem: string) {
    // await this.mailerService.sendMail({
    //   to: destination,
    //   from: 'mayronfernandes01@gmail.com',
    //   subject,
    //   html: `<h3 style="color: red">${mensagem}</h3>`,
    // });
    console.log('Enviar email');
  }
}
