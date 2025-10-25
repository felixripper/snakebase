/**
 * Rate limiting middleware using Upstash
 * Protects API endpoints from abuse
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Initialize rate limiter
let ratelimit: Ratelimit | null = null;

function getRateLimiter() {
  if (ratelimit) return ratelimit;

  // Check if Redis is configured
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn('Rate limiting disabled: Redis not configured');
    return null;
  }

  try {
    const redis = new Redis({
      url,
      token,
    });

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
      analytics: true,
      prefix: '@upstash/ratelimit',
    });

    return ratelimit;
  } catch (error) {
    console.error('Failed to initialize rate limiter:', error);
    return null;
  }
}

/**
 * Check rate limit for a given identifier (usually IP address)
 * Returns NextResponse with 429 status if rate limit exceeded, null otherwise
 *
 * @param identifier - Usually the IP address or user ID
 * @returns NextResponse if rate limited, null if allowed
 */
export async function checkRateLimit(identifier: string): Promise<NextResponse | null> {
  const limiter = getRateLimiter();

  // If rate limiting is not configured, allow all requests
  if (!limiter) {
    return null;
  }

  try {
    const { success, limit, reset } = await limiter.limit(identifier);

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          limit,
          remaining: 0,
          reset: new Date(reset).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    return null;
  } catch (error) {
    console.error('Rate limit check error:', error);
    // On error, allow the request (fail open)
    return null;
  }
}

/**
 * Get IP address from request headers
 * Supports various deployment platforms (Vercel, Cloudflare, etc.)
 */
export function getClientIP(request: Request): string {
  // Try various headers in order of preference
  const headers = request.headers;

  const ip =
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') || // Cloudflare
    headers.get('true-client-ip') || // Cloudflare Enterprise
    headers.get('x-client-ip') ||
    'unknown';

  return ip;
}

/**
 * Convenience function to check rate limit using request IP
 * Use this in API routes
 *
 * Example:
 * ```typescript
 * export async function POST(request: Request) {
 *   const rateLimitError = await rateLimitByIP(request);
 *   if (rateLimitError) return rateLimitError;
 *   // ... rest of your code
 * }
 * ```
 */
export async function rateLimitByIP(request: Request): Promise<NextResponse | null> {
  const ip = getClientIP(request);
  return checkRateLimit(ip);
}
