import { Process, Processor, OnGlobalQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

type SendActiveAccEmailProps = {
  userId: number;
  email: string;
};
@Processor('email')
export class EmailConsumer {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @OnGlobalQueueFailed()
  handler(job: Job, error: Error) {
    console.log(job);
    console.error(error);
  }
  @Process('active')
  async sendActiveAccEmail(job: Job<SendActiveAccEmailProps>) {
    const userID = job.data.userId;
    const id = randomUUID();
    await this.cacheManager.set(id, userID);
    console.log(id);
  }
  @Process('reset')
  async sendResetPassEmail(job: Job<number>) {
    const userID = job.data;
    const id = randomUUID();
    await this.cacheManager.set(id, userID);
    console.log(id);
  }
}
