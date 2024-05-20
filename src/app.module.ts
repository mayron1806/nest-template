import { Module } from '@nestjs/common';
import { EmailModule } from './modules/email/email.module';
import { AuthModule } from './api/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from './modules/prisma/prisma.service';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { env } from './constants/env';
import type { RedisClientOptions } from 'redis';
@Module({
  imports: [
    AuthModule,
    EmailModule,
    PrismaModule,
    BullModule.forRoot({
      redis: {
        username: env.REDIS_USER,
        password: env.REDIS_PASSWORD,
        host: env.REDIS_HOST,
        port: parseInt(env.REDIS_PORT),
      },
    }),
    // CacheModule.register({
    //   store: redisStore,
    //   url: env.REDIS_URL,
    //   ttl: 5 * 60,
    //   isGlobal: true
    // }),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          ttl: 60 * 5,
          url: env.REDIS_URL,
        })
      }),
      isGlobal: true
    }),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
      global: true,
    })
  ],
})
export class AppModule {}
