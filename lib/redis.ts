import { Redis } from '@upstash/redis';

const memory = new Map<string, string>();

let _redis: Redis | undefined;

function getRedis(): Redis | undefined {
  if (_redis !== undefined) return _redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (typeof url === 'string' && typeof token === 'string' && url.startsWith('https://')) {
    _redis = new Redis({ url, token });
  } else {
    // Geçersiz ya da eksik env varsa Redis devre dışı; hafıza fallback
    _redis = undefined;
  }
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