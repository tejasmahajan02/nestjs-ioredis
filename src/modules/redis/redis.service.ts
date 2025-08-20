import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public redisClient: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
    });
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }
  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async setWithExpiry(
    key: string,
    value: string,
    expiryInSeconds: number,
  ): Promise<void> {
    await this.redisClient.set(key, value, 'EX', expiryInSeconds);
  }

  async increment(key: string, incrementBy = 1): Promise<number> {
    return await this.redisClient.incrby(key, incrementBy);
  }

  async setMany(data: { key: string; value: string }[]) {
    const pipeline = this.redisClient.pipeline();

    for (const { key, value } of data) {
      pipeline.set(key, value);
    }

    await pipeline.exec();
  }

  async setManyWithExpiry(data: { key: string; value: string; ttl: number }[]) {
    const pipeline = this.redisClient.pipeline();

    for (const { key, value, ttl } of data) {
      pipeline.set(key, value, 'EX', ttl);
    }

    await pipeline.exec();
  }

  async deleteMany(keys: string[]): Promise<void> {
    await this.redisClient.del(keys);
  }
}
