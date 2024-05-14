import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { EmailUtils } from 'src/Utils/Email.utils';
import { Security } from 'src/Utils/Security.utils';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';

export type JwtPayload = {
  data: string;
};

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
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
      ? this.txHost.tx.user.findUnique({ where: { email: account }})
      : this.txHost.tx.user.findUnique({ where: { name: account }}));
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
