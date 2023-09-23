import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RepositoryModule } from '../../Repositories/repository.module';
import { CacheModule as CM } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './jobs/email.consumer';
import * as redisStore from 'cache-manager-redis-store';
import { EmailModule } from 'src/modules/email/email.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, EmailConsumer],
  imports: [
    EmailModule,
    RepositoryModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_TOKEN_LIFE_TIME },
    }),
    CM.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 5 * 60, // 5 minutos
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
})
export class AuthModule {}
