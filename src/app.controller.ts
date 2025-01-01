import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './modules/redis/redis.service';
import { RedisPrefix } from './modules/redis/enums/redis-prefix.enum';

@Controller()
export class AppController {

  private uniqueId = 0;

  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('product')
  async setProduct(
    @Query('key') key: string,
    @Query('value') value: string
  ): Promise<string> {
    await this.redisService.set(RedisPrefix.PRODUCT, `${key}:${this.uniqueId++}`, value);
    return `${key}:${value} stored in redis.`;
  }

  @Get('visits')
  async countVisits(): Promise<string> {
    return await this.appService.countVisits();
  }
}
