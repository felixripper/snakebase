/**
 * Authentication helper functions
 * Admin API endpoint'lerini korumak için kullanılır
 */

import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, type SessionData } from './session';

/**
 * Kullanıcının giriş yapmış olup olmadığını kontrol eder
 * Checks if the user is authenticated
 *
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    return session.isLoggedIn === true;
  } catch (error) {
    console.error('Authentication check error:', error);
    return false;
  }
}

/**
 * API route'ları için authentication middleware
 * Giriş yapmamış kullanıcıları reddeder
 *
 * Kullanım / Usage:
 * ```typescript
 * export async function POST(request: Request) {
 *   const authError = await requireAuth();
 *   if (authError) return authError;
 *   // ... rest of your code
 * }
 * ```
 */
export async function requireAuth(): Promise<NextResponse | null> {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        message: 'Bu işlem için giriş yapmanız gerekiyor / Authentication required',
      },
      { status: 401 }
    );
  }

  return null;
}
