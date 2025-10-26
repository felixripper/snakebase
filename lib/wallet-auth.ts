import { randomBytes } from 'crypto';

export function generateNonce(): string {
  // 16 bytes hex nonce
  return randomBytes(16).toString('hex');
}

export function buildSignMessage(address: string, nonce: string, issuedAt: number): string {
  return [
    'Sign in to Snakebase',
    '',
    `Address: ${address}`,
    `Nonce: ${nonce}`,
    `IssuedAt: ${issuedAt}`
  ].join('\n');
}

export const NONCE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function isNonceExpired(issuedAt: number): boolean {
  return Date.now() - issuedAt > NONCE_TTL_MS;
}
