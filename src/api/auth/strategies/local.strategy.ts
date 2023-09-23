import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { UserRepository } from 'src/Repositories/user/user.repository';
import { EmailUtils } from 'src/Utils/Email.utils';
import { Security } from 'src/Utils/Security.utils';

export type JwtPayload = {
  data: string;
};

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authRepository: UserRepository,
    @InjectQueue('email') private emailQueue: Queue,
  ) {
    super({
      usernameField: 'account',
      passwordField: 'password',
    });
  }

  async validate(account: string, password: string) {
    // define se é email ou nome e faz login
    const user = await (EmailUtils.validateEmail(account)
      ? this.authRepository.getUserByEmail(account)
      : this.authRepository.getUserByName(account));
    if (!user) {
      throw new UnauthorizedException('Usuario e/ou senha incorreto(s)');
    }
    if (user.status === 'VerifyEmail') {
      console.log(user.id);
      await this.emailQueue.add('active', {
        userId: user.id,
        email: user.email,
      });
      throw new UnauthorizedException(
        'É necessario fazer a verificação do seu email antes de fazer o primeiro login',
      );
    }
    const correctPass = await Security.hashCompare(password, user.password);
    if (!correctPass)
      throw new UnauthorizedException('Usuario e/ou senha incorreto(s)');
    return user;
  }
}
