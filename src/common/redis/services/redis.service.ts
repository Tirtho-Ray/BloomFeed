import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redis!: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisUrl =
      this.configService.get<string>('redis.url') ||
      `redis://${this.configService.get<string>('redis.host') || 'localhost'}:${this.configService.get<number>('redis.port') || 6379}`;

    this.redis = new Redis(redisUrl);
  }

  // --- Key calue ---

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async del(key: string) {
    await this.redis.del(key);
  }

  // --- Hash Operations  ---

  async hSet(hash: string, key: string, value: string) {
    await this.redis.hset(hash, key, value);
  }

  async hGet(hash: string, key: string) {
    return this.redis.hget(hash, key);
  }

  async hDel(hash: string, key: string) {
    await this.redis.hdel(hash, key);
  }

  async hGetAll(hash: string) {
    return this.redis.hgetall(hash);
  }

  // ---security--

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  /**
   * Token Bucket algorithm for rate limiting
   * @param key Redis key
   * @param capacity Max tokens in bucket
   * @param refillRate Tokens per second
   * @returns { hasTokens: boolean, remainingTokens: number }
   */
  async tokenBucket(
    key: string,
    capacity: number,
    refillRate: number,
  ): Promise<{ hasTokens: boolean; remainingTokens: number }> {
    const now = Date.now() / 1000;
    const bucketKey = `tb:${key}`;
    const data = await this.redis.hgetall(bucketKey);

    let tokens = parseFloat(data.tokens || capacity.toString());
    const lastRefill = parseFloat(data.lastRefill || now.toString());

    // Refill tokens
    const delta = (now - lastRefill) * refillRate;
    tokens = Math.min(capacity, tokens + delta);

    if (tokens >= 1) {
      tokens -= 1;
      await this.redis.hset(
        bucketKey,
        'tokens',
        tokens.toString(),
        'lastRefill',
        now.toString(),
      );
      // Set expiry to 1 hour to cleanup old buckets
      await this.redis.expire(bucketKey, 3600);
      return { hasTokens: true, remainingTokens: Math.floor(tokens) };
    }

    return { hasTokens: false, remainingTokens: Math.floor(tokens) };
  }
}
