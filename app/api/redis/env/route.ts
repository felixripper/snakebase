import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return NextResponse.json({
    urlPresent: typeof url === 'string' && url.length > 0,
    urlStartsWithHttps: typeof url === 'string' && url.startsWith('https://'),
    tokenPresent: typeof token === 'string' && token.length > 0,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
    note: 'This endpoint does not expose secret values; only presence/format is reported.',
  });
}