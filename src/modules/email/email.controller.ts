import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Get('')
  public async sendEmail() {
    await this.emailService.enviarEmail(
      'devforever85@gmail.com',
      'teste',
      'teste',
    );
  }
}
