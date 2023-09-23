import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/Repositories/user/user.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/Entities/User';
import { Security } from 'src/Utils/Security.utils';
import { CreateUserRequest } from './dto/request/create-user-request';
import { ResetPasswordRequest } from './dto/request/reset-password-request';
import { LoginResponse } from './dto/response/login.response';
import { RefreshTokenContent } from './types/refresh-token-content';
import * as moment from 'moment';
import { RefreshTokenRequest } from './dto/request/refresh-token-request';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('email') private emailQueue: Queue,
    private jwt: JwtService,
  ) {}

  private generateRefreshToken(userId: number, accessToken: string) {
    const refreshTokenContent: RefreshTokenContent = {
      userId,
      expiration: moment().add(7, 'days').toDate(),
      token: accessToken,
    };

    const refreshToken = this.jwt.sign(
      { data: Security.encrypt(JSON.stringify(refreshTokenContent)) },
      { expiresIn: '7d' },
    );
    return refreshToken;
  }
  public async activeAccount(key: string) {
    const userId = await this.cacheManager.get<number>(key);
    if (!userId) {
      throw new UnauthorizedException(
        'O token já foi expirado. Tente realizar login para gerar um novo token e ativar a sua conta.',
      );
    }
    const user = await this.authRepo.getByID(userId);
    if (!user) {
      throw new BadRequestException(
        'O token é invalido. Tente realizar login para gerar um novo token e ativar a sua conta.',
      );
    }
    user.status = 'Active';
    await this.authRepo.update(user.id, user);
    return { result: true };
  }
  public async createAccount(createUserDto: CreateUserRequest) {
    // se não tem email
    if (!!!createUserDto.email) {
      throw new BadRequestException('Você precisa informar o campo email');
    }
    // verifica se email ou nome estão em uso
    const existsName = await this.authRepo.existsByName(createUserDto.name);
    if (existsName) {
      throw new BadRequestException('Nome de usuario já está em uso');
    }
    const existsEmail = await this.authRepo.existsByEmail(createUserDto.email);
    if (existsEmail) {
      throw new BadRequestException('Email já está em uso');
    }
    const password = await Security.hash(createUserDto.password);

    // cria uma entidade para o usuario
    const newUser = await this.authRepo.add(
      new UserEntity({
        ...createUserDto,
        password,
        permissions: [],
        status: 'VerifyEmail',
      }),
    );

    await this.emailQueue.add('active', {
      userId: newUser.id,
      email: newUser.email,
    });
    return;
  }
  public login(userID: number) {
    const token = this.jwt.sign({ data: Security.encrypt(userID) });
    const refreshToken = this.generateRefreshToken(userID, token);

    const res = new LoginResponse();
    res.accessToken = token;
    res.expiresIn = 300;
    res.refreshToken = refreshToken;
    return res;
  }
  public async refreshToken({
    accessToken,
    refreshToken,
  }: RefreshTokenRequest) {
    const res = await this.jwt.verifyAsync(refreshToken);
    const dataString = Security.decrypt(res.data);
    const data = JSON.parse(dataString) as RefreshTokenContent;
    if (data.token !== accessToken) {
      throw new UnauthorizedException(
        'Erro ao recarregar o token, faça login novamente',
      );
    }
    const user = await this.authRepo.getByID(data.userId);
    if (!user) throw new BadRequestException('Usuario não encontrado');

    return this.login(data.userId);
  }
  public async resetPassword(data: ResetPasswordRequest, key?: string) {
    if (data.type == 'sendEmail') {
      const user = await this.authRepo.getUserByEmail(data.email);
      if (!user) {
        throw new NotFoundException(
          'Usuario não encontrado com o email fornecido.',
        );
      }
      await this.emailQueue.add('reset', user.id);
      return { result: true };
    } else if (data.type == 'resetPassword') {
      if (!key) {
        throw new BadRequestException(
          'A chave deve ser fornecida para resetar a senha.',
        );
      }
      if (!data.password || !data.confirmPassword) {
        throw new BadRequestException('As senhas não podem ser nulas.');
      }
      if (data.password !== data.confirmPassword) {
        throw new BadRequestException('As senhas não conferem.');
      }
      const userId = await this.cacheManager.get<number>(key);
      if (!userId) {
        throw new UnauthorizedException(
          'O token já foi expirado. Tente realizar login para gerar um novo token e ativar a sua conta.',
        );
      }
      const user = await this.authRepo.getByID(userId);
      if (!user) {
        throw new BadRequestException(
          'O token é invalido. Tente realizar login para gerar um novo token e ativar a sua conta.',
        );
      }
      user.password = await Security.hash(data.password);
      await this.authRepo.update(user.id, user);
      return { result: true };
    } else {
      return { result: false };
    }
  }
}
