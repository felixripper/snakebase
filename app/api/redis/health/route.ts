import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  const hasRedisEnv = typeof url === 'string' && typeof token === 'string' && url.startsWith('https://');
  if (!hasRedisEnv) {
    return NextResponse.json({ provider: 'memory', connected: true, note: 'Falling back to in-memory (non-persistent) store.' });
  }

  try {
    const client = new Redis({ url: url as string, token: token as string });
    const key = `healthcheck:${Date.now()}`;
    await client.set(key, 'ok', { ex: 10 });
    const val = await client.get<string>(key);
    const connected = val === 'ok';
    return NextResponse.json({ provider: 'redis', connected });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'unknown error';
    return NextResponse.json({ provider: 'redis', connected: false, error: message }, { status: 500 });
  }
}