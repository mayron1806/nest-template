import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { EmailModule } from './modules/email/email.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    EmailModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
