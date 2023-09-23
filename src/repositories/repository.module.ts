import { Module } from '@nestjs/common';
import { UserRepository } from './user/user.repository';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService, UserRepository],
  exports: [PrismaService, UserRepository],
})
export class RepositoryModule {}
