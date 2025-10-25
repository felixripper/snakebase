import { Redis } from '@upstash/redis';

let memory = new Map<string, string>();

export const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      })
    : undefined;

export async function kvGet(key: string): Promise<string | null> {
  if (redis) {
    return (await redis.get<string>(key)) ?? null;
  }
  return memory.get(key) ?? null;
}

export async function kvSet(key: string, value: string): Promise<void> {
  if (redis) {
    await redis.set(key, value);
    return;
  }
  memory.set(key, value);
}