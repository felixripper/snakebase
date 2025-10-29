// Score validation helpers (simplified for game-only mode)

export function buildScoreMessage(walletAddress: string, score: number, nonce: string, timestamp: number): string {
  return [
    'Snake Game Score Submission',
    '',
    `Wallet: ${walletAddress}`,
    `Score: ${score}`,
    `Nonce: ${nonce}`,
    `Timestamp: ${timestamp}`,
  ].join('\n');
}

// In game-only mode we don't verify on-chain signatures. This function
// returns true to allow score processing in the simplified flow.
export async function verifyScoreSignature(
  _walletAddress: string,
  _score: number,
  _nonce: string,
  _timestamp: number,
  _signature: string
): Promise<boolean> {
  return true;
}

// Nonce and timestamp age check (5 minute window)
export function isScoreSubmissionValid(timestamp: number, maxAgeMs = 5 * 60 * 1000): boolean {
  const now = Date.now();
  const age = now - timestamp;
  return age >= 0 && age <= maxAgeMs;
}
