import { Process, Processor, OnGlobalQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from 'src/modules/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { EMAIL_TOKEN_EXPIRATION_TIME } from '../constants/token.constant';
import { EmailToken } from '../types/email-token';
import { Logger } from '@nestjs/common';
import { env } from 'src/constants/env';

type SendActiveAccEmailProps = {
  userId: number;
  email: string;
  name: string;
};
type ResetPasswordAccProps = {
  userId: number;
  email: string;
  name: string;
};
@Processor('email')
export class EmailConsumer {
  private readonly logger = new Logger()
  constructor(
    private readonly emailService: EmailService,
    private readonly jwt: JwtService,
  ) {}

  @OnGlobalQueueFailed()
  handler(job: Job, error: Error) {
    console.log(job);
    console.error(error);
  }
  @Process('active')
  async sendActiveAccEmail(job: Job<SendActiveAccEmailProps>) {
    this.logger.log("Active account email queue");
    const userID = job.data.userId;
    const payload: EmailToken = {
      id: userID,
      type: 'active-account',
    };
    const token = this.jwt.sign(payload, {
      expiresIn: EMAIL_TOKEN_EXPIRATION_TIME,
    });
    if (!env.IS_PRODUCTION) this.logger.debug(token);
    const url = `${env.HOST}/active-account?token=${token}`;
    
    await this.emailService.sendEmailFromTemplate(
      job.data.email,
      'Ativação de conta',
      'confirm-create-account',
      {
        name: job.data.name,
        confirmationUrl: url,
      },
    );
    this.logger.log("End active account email queue");

  }
  @Process('reset')
  async sendResetPassEmail(job: Job<ResetPasswordAccProps>) {
    this.logger.log("sendResetPassEmail");
    const userID = job.data.userId;
    const payload: EmailToken = {
      id: userID,
      type: 'reset-password',
    };
    const token = this.jwt.sign(payload, {
      expiresIn: EMAIL_TOKEN_EXPIRATION_TIME,
    });
    await this.emailService.sendEmailFromTemplate(
      job.data.email,
      'Esquecimento de senha',
      'reset-password',
      {
        name: job.data.name,
        resetUrl: `${env.HOST}/reset-password?token=${token}`,
      },
    );
    this.logger.log("End sendResetPassEmail");
  }
}
