import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/Repositories/user/user.repository';
import { Security } from 'src/Utils/Security.utils';

export type JwtPayload = {
  data: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const id = Security.decrypt(payload.data);
    if (!id) throw new UnauthorizedException('Tente logar novamente.');

    const user = await this.authRepository.getByID(+id);
    if (!user) throw new UnauthorizedException('Tente logar novamente.');
    return user;
  }
}
