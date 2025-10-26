import { verifyMessage } from 'viem';

// Skor doğrulama için helper fonksiyonlar

export function buildScoreMessage(walletAddress: string, score: number, nonce: string, timestamp: number): string {
  return [
    'Snake Game Score Submission',
    '',
    `Wallet: ${walletAddress}`,
    `Score: ${score}`,
    `Nonce: ${nonce}`,
    `Timestamp: ${timestamp}`
  ].join('\n');
}

export async function verifyScoreSignature(
  walletAddress: string,
  score: number,
  nonce: string,
  timestamp: number,
  signature: string
): Promise<boolean> {
  try {
    const message = buildScoreMessage(walletAddress, score, nonce, timestamp);
    const valid = await verifyMessage({
      address: walletAddress as `0x${string}`,
      message,
      signature: signature as `0x${string}`
    });
    return valid;
  } catch {
    return false;
  }
}

// Nonce ve timestamp yaşını kontrol et (5 dakikalık pencere)
export function isScoreSubmissionValid(timestamp: number, maxAgeMs = 5 * 60 * 1000): boolean {
  const now = Date.now();
  const age = now - timestamp;
  return age >= 0 && age <= maxAgeMs;
}
