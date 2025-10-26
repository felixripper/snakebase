import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, type SessionData } from '@/lib/session';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Rate limiting: 5 attempts per 15 minutes per IP
const createRateLimiter = () => {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    console.warn('Rate limiting disabled: Redis not configured');
    return null;
  }
  
  try {
    const redis = new Redis({ url, token });
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: true,
    });
  } catch (error) {
    console.error('Failed to create rate limiter:', error);
    return null;
  }
};

const ratelimit = createRateLimiter();

export async function POST(request: Request) {
  // Rate limiting check
  if (ratelimit) {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const { success, limit, remaining, reset } = await ratelimit.limit(`login_${ip}`);
    
    if (!success) {
      return NextResponse.json(
        { 
          message: 'Çok fazla başarısız giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.',
          retryAfter: Math.floor((reset - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
          }
        }
      );
    }
  }

  const { username, password } = await request.json();

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    session.isLoggedIn = true;
    await session.save();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { message: 'Geçersiz kullanıcı adı veya şifre.' },
    { status: 401 }
  );
}
