// Score validation helpers with anti-cheat measures

import type { HistoryEntry } from './score-store';

export interface ScoreValidationResult {
  valid: boolean;
  error?: string;
  score?: number;
}

// Basic score validation
export function validateScore(score: unknown): ScoreValidationResult {
  if (typeof score !== 'number') {
    return { valid: false, error: 'Score must be a number' };
  }

  if (!Number.isFinite(score)) {
    return { valid: false, error: 'Score must be finite' };
  }

  if (score < 0) {
    return { valid: false, error: 'Score cannot be negative' };
  }

  if (score > 1000000) {
    return { valid: false, error: 'Score too high (max: 1,000,000)' };
  }

  // Check for suspicious patterns (all same digits, etc.)
  const scoreStr = score.toString();
  if (scoreStr.length > 1) {
    const firstDigit = scoreStr[0];
    const allSame = scoreStr.split('').every(digit => digit === firstDigit);
    if (allSame && score > 111) {
      return { valid: false, error: 'Suspicious score pattern detected' };
    }
  }

  return { valid: true, score: Math.floor(score) };
}

// Advanced validation with user history
export async function validateScoreWithHistory(
  userId: string,
  score: number,
  walletAddress: string
): Promise<ScoreValidationResult> {
  const basicValidation = validateScore(score);
  if (!basicValidation.valid) {
    return basicValidation;
  }

  try {
    // Import here to avoid circular dependencies
    const { getHistoryByWallet } = await import('./score-store');

    const history = await getHistoryByWallet(walletAddress);

    // Check for rapid submissions (anti-spam)
    const recentSubmissions = history.filter((entry: HistoryEntry) => {
      const age = Date.now() - entry.ts;
      return age < 30 * 1000; // Last 30 seconds
    });

    if (recentSubmissions.length >= 3) {
      return { valid: false, error: 'Too many submissions in short time' };
    }

    // Check for unrealistic score progression
    const lastScore = Math.max(...history.map((entry: HistoryEntry) => entry.score));
    const improvement = score - lastScore;

    if (improvement > 500 && lastScore > 100) {
      // Allow some improvement but flag suspicious jumps
      console.warn(`Suspicious score improvement: ${lastScore} -> ${score} for ${walletAddress}`);
    }

    return { valid: true, score: Math.floor(score) };
  } catch (error) {
    console.error('History validation error:', error);
    // If history check fails, still allow the score but log the error
    return { valid: true, score: Math.floor(score) };
  }
}
