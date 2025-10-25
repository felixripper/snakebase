import * as Sentry from '@sentry/nextjs';

// Next.js server instrumentation file
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
export async function register() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
  });
}
