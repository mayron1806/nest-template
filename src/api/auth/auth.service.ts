import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { JwtService } from '@nestjs/jwt';
import { Security } from 'src/Utils/Security.utils';
import { CreateUserRequest } from './dto/request/create-user-request';
import { ResetPasswordRequest } from './dto/request/reset-password-request';
import { LoginResponse } from './dto/response/login.response';
import { RefreshTokenContent } from './types/refresh-token-content';
import * as moment from 'moment';
import { RefreshTokenRequest } from './dto/request/refresh-token-request';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { EmailToken } from './types/email-token';

@Injectable()
export class AuthService {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('email') private emailQueue: Queue,
    private jwt: JwtService,
  ) {}

  private generateRefreshToken(userId: number) {
    const refreshTokenContent: RefreshTokenContent = {
      userId,
      expiration: moment().add(7, 'days').toDate(),
    };

    const refreshToken = this.jwt.sign(
      { data: Security.encrypt(JSON.stringify(refreshTokenContent)) },
      { expiresIn: '7d' },
    );
    return refreshToken;
  }
  public async activeAccount(token: string) {
    let payload: EmailToken = {} as EmailToken;
    try {
      payload = this.jwt.verify<EmailToken>(token);
    } catch (error) {
      throw new BadRequestException('Token invalido.');
    }
    if (!payload || payload.type !== 'active-account' || !payload.id) {
      throw new BadRequestException('Token invalido.');
    }
    const userId = payload.id;
    if (!userId) {
      throw new BadRequestException(
        'O token já foi expirado. Tente realizar login para gerar um novo token e ativar a sua conta.',
      );
    }
    const user = await this.txHost.tx.user.findUnique({ where: { id: userId }});
    if (!user) {
      throw new BadRequestException(
        'O token é invalido. Tente realizar login para gerar um novo token e ativar a sua conta.',
      );
    }
    await this.txHost.tx.user.update({ where: { id: userId }, data: { status: 'Active' } });
    return true;
  }
  public async createAccount(createUserDto: CreateUserRequest) {
    // verifica se email ou nome estão em uso
    const existsName = await this.txHost.tx.user.findFirst({ where: { name: createUserDto.name }});
    if (existsName) {
      throw new BadRequestException('Nome de usuario já está em uso');
    }
    const existsEmail = await this.txHost.tx.user.findFirst({ where: { email: createUserDto.email }});
    if (existsEmail) {
      throw new BadRequestException('Email já está em uso');
    }
    const password = await Security.hash(createUserDto.password);

    // cria uma entidade para o usuario
    const newUser = await this.txHost.tx.user.create({
      data: {
        name: createUserDto.name,
        password,
        email: createUserDto.email,
        permissions: [],
      }
    });

    await this.emailQueue.add('active', {
      userId: newUser.id,
      email: newUser.email,
    });
    return;
  }
  public login(userID: number) {
    const token = this.jwt.sign({ data: Security.encrypt(userID) });
    const refreshToken = this.generateRefreshToken(userID);

    const res = new LoginResponse();
    res.accessToken = token;
    res.expiresIn = 300;
    res.refreshToken = refreshToken;
    return res;
  }
  public async refreshToken({
    refreshToken,
  }: RefreshTokenRequest) {
    const res = await this.jwt.verifyAsync(refreshToken);
    const dataString = Security.decrypt(res.data);
    const data = JSON.parse(dataString) as RefreshTokenContent;
    const user = await this.txHost.tx.user.findUnique({ where: { id: data.userId }});
    if (!user) throw new BadRequestException('Usuario não encontrado');
    return this.login(data.userId);
  }
  public async resetPassword(data: ResetPasswordRequest, token?: string) {
    if (data.type == 'sendEmail') {
      const user = await this.txHost.tx.user.findUnique({ where: { email: data.email }});
      if (!user) {
        throw new NotFoundException(
          'Usuario não encontrado com o email fornecido.',
        );
      }
      await this.emailQueue.add('reset', {
        userId: user.id,
        email: user.email,
        name: user.name,
      });
      return true;
    } else if (data.type == 'resetPassword') {
      if (!token) {
        throw new BadRequestException(
          'O token deve ser fornecido para resetar a senha.',
        );
      }
      let payload: EmailToken = {} as EmailToken;
      try {
        payload = await this.jwt.verify<EmailToken>(token);
      } catch (error) {
        Logger.error(error);
        throw new BadRequestException('Token invalido.');
      }
      if (!payload || payload.type !== 'reset-password' || !payload.id) {
        Logger.error('Token invalido');

        throw new BadRequestException('Token invalido.');
      }
      const user = await this.txHost.tx.user.findUnique({ where: { id: payload.id }});
      if (!user) {
        throw new BadRequestException(
          'O token é invalido. Tente realizar login para gerar um novo token e ativar a sua conta.',
        );
      }
      user.password = await Security.hash(data.password);
      await this.txHost.tx.user.update({
        where: { id: user.id },
        data: { password: user.password },
      })
      return true;
    } else {
      return false;
    }
  }
}
