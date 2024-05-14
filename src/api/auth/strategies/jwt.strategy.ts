import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Security } from 'src/Utils/Security.utils';
import { env } from 'src/constants/env';

export type JwtPayload = {
  data: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const id = Security.decrypt(payload.data);
    if (!id) throw new UnauthorizedException('Tente logar novamente.');

    const user = await this.txHost.tx.user.findUnique({ where: { id: parseInt(id) }});
    if (!user) throw new UnauthorizedException('Tente logar novamente.');
    return user;
  }
}
