import { Injectable } from '@nestjs/common';
import { RedisService } from './modules/redis/redis.service';
import { RedisPrefix } from './modules/redis/enums/redis-prefix.enum';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async countVisits(): Promise<string> {
    const hits = await this.redisService.increment(
      `${RedisPrefix.HITS}:ioredis`,
    );
    return `This page has been visited ${hits} times.`;
  }
}
