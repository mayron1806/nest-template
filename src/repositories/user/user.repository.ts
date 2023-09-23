/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserEntity } from 'src/Entities/User';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async getByID(id: number): Promise<UserEntity> {
    const res = await this.prisma.user.findUniqueOrThrow({
      where: { id },
    });
    return res as UserEntity;
  }

  async add(data: UserEntity): Promise<UserEntity> {
    const res = await this.prisma.user.create({ data });
    return res as UserEntity;
  }

  async update(id: number, data: UserEntity): Promise<UserEntity> {
    const res = await this.prisma.user.update({
      where: { id },
      data,
    });
    return res as UserEntity;
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.prisma.user.delete({ where: { id } });
    return !!res;
  }

  async getUserByName(name: string) {
    const res = await this.prisma.user.findUnique({
      where: { name },
    });
    return res as UserEntity;
  }
  async getUserByEmail(email: string) {
    const res = await this.prisma.user.findUnique({
      where: { email },
    });
    return res as UserEntity;
  }
  async existsByName(name: string) {
    const res = await this.prisma.user.findUnique({
      where: { name },
    });
    return !!res;
  }
  async existsByNameOrEmail(name: string, email: string): Promise<boolean> {
    const res = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { name }],
      },
    });
    return !!res;
  }
  async existsByEmail(email: string) {
    const res = await this.prisma.user.findUnique({
      where: { email },
    });
    return !!res;
  }
}
