import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './jobs/email.consumer';
import { EmailModule } from 'src/modules/email/email.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { env } from 'src/constants/env';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, EmailConsumer],
  imports: [
    EmailModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.JWT_TOKEN_LIFE_TIME },
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
})
export class AuthModule {}
