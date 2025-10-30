import { NextResponse } from 'next/server';
import { getAppRouterSession } from '@/lib/session';
import { getUserById } from '@/lib/user-store';
import { validateScoreWithHistory } from '@/lib/score-validation';
import { submitScoreForSession } from '@/lib/score-store';
import { submitScoreOnChain, BLOCKCHAIN_ENABLED } from '@/lib/contract';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getAppRouterSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { score, userId, walletAddress } = await request.json();

    // Validate user matches session
    if (userId !== session.userId) {
      return NextResponse.json(
        { error: 'User mismatch' },
        { status: 403 }
      );
    }

    // Get user data
    const user = await getUserById(userId);
    if (!user || user.walletAddress !== walletAddress) {
      return NextResponse.json(
        { error: 'Invalid user' },
        { status: 400 }
      );
    }

    // Validate score with history
    const scoreValidation = await validateScoreWithHistory(userId, score, walletAddress);
    if (!scoreValidation.valid) {
      return NextResponse.json(
        { error: scoreValidation.error },
        { status: 400 }
      );
    }

    // Submit score to store
    const stats = await submitScoreForSession(userId, scoreValidation.score!);

    // Attempt on-chain submission if enabled
    let onChainResult = null;
    if (BLOCKCHAIN_ENABLED) {
      try {
        onChainResult = await submitScoreOnChain(walletAddress, scoreValidation.score!);
        if (!onChainResult.success) {
          console.warn('On-chain submission failed:', onChainResult.error);
          // Continue with off-chain storage even if on-chain fails
        }
      } catch (error) {
        console.error('On-chain submission error:', error);
        // Continue with off-chain storage
      }
    }

    console.log(`Score submission: ${scoreValidation.score} for user ${userId}, stats:`, stats, 'onChain:', onChainResult);

    return NextResponse.json({
      success: true,
      message: 'Score submitted successfully',
      stats: {
        totalGames: stats.totalGames,
        highScore: stats.highScore,
        totalScore: stats.totalScore
      },
      ...(onChainResult?.success && {
        transactionHash: onChainResult.transactionHash,
        onChainSubmitted: true
      })
    }, { status: 200 });

  } catch (error) {
    console.error('Score submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}