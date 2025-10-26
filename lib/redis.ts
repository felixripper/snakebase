import { Redis } from '@upstash/redis';

const memory = new Map<string, string>();

let _redis: Redis | undefined;

function normalizeRestUrl(url: string): string {
  // If the URL is a TLS Redis URL (rediss://...), normalize to REST base (https://...)
  if (url.startsWith('rediss://')) return url.replace(/^rediss:\/\//, 'https://');
  // Some dashboards expose tcp/redis scheme as well; handle cautiously
  if (url.startsWith('redis://')) return url.replace(/^redis:\/\//, 'https://');
  return url;
}

function getRedis(): Redis | undefined {
  if (_redis !== undefined) return _redis;

  const urlRaw = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (typeof urlRaw === 'string' && typeof token === 'string' && urlRaw.length > 0) {
    const url = normalizeRestUrl(urlRaw);
    if (url.startsWith('https://')) {
      _redis = new Redis({ url, token });
    }
  }

  // If not initialized, leave undefined to use in-memory fallback
  return _redis;
}

export async function kvGet(key: string): Promise<string | null> {
  const redis = getRedis();
  if (redis) {
    return (await redis.get<string>(key)) ?? null;
  }
  return memory.get(key) ?? null;
}

export async function kvSet(key: string, value: string): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(key, value);
    return;
  }
  memory.set(key, value);
}

export async function kvDel(key: string): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await (redis as unknown as { del: (k: string) => Promise<void> }).del(key);
    return;
  }
  memory.delete(key);
}