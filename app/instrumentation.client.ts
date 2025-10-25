import * as Sentry from '@sentry/nextjs';

// Next.js client instrumentation file for Sentry
export function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
    integrations: [],
  });
}
