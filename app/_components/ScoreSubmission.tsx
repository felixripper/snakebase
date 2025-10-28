'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from '@/lib/noop-wagmi';
import styles from './ScoreSubmission.module.css';

interface ScoreSubmissionProps {
  score: number;
  contractAddress: `0x${string}`;
  contractABI: readonly unknown[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ScoreSubmission({
  score,
  contractAddress,
  contractABI,
  onSuccess,
  onCancel
}: ScoreSubmissionProps) {
  const { address, isConnected } = useAccount();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { 
    data: hash,
    isPending,
    writeContract,
    error: writeError
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash,
    });

  useEffect(() => {
    if (isConfirmed && !isSubmitted) {
      setIsSubmitted(true);
      setTimeout(() => {
        onSuccess?.();
      }, 3000);
    }
  }, [isConfirmed, isSubmitted, onSuccess]);

  const handleSubmit = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'submitScore',
        args: [BigInt(score)],
      });
    } catch (err) {
      console.error('Score submission error:', err);
    }
  };

  if (isConfirmed) {
    return (
      <div className={styles.container}>
        <div className={styles.success}>
          <div className={styles.successIcon}>🎉</div>
          <h3>Score Submitted!</h3>
          <p className={styles.scoreText}>Your score: {score}</p>
          <p className={styles.message}>
            Your score has been recorded on the blockchain
          </p>
        </div>
      </div>
    );
  }

  if (isPending || isConfirming) {
    return (
      <div className={styles.container}>
        <div className={styles.processing}>
          <div className={styles.spinner}></div>
          <p>
            {isPending && 'Waiting for wallet confirmation...'}
            {isConfirming && 'Submitting score to blockchain...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3>Submit Your Score</h3>
        <div className={styles.scoreDisplay}>
          <span className={styles.scoreLabel}>Your Score</span>
          <span className={styles.scoreValue}>{score}</span>
        </div>

        {!isConnected ? (
          <div className={styles.notice}>
            <p>⚠️ Please connect your wallet to submit your score</p>
          </div>
        ) : (
          <>
            <p className={styles.description}>
              Submit your score to the blockchain leaderboard. This will require a small gas fee.
            </p>

            {writeError && (
              <div className={styles.error}>
                <p>❌ Error: {writeError.message}</p>
              </div>
            )}

            <div className={styles.buttons}>
              <button
                onClick={handleSubmit}
                disabled={isPending || isConfirming}
                className={styles.submitBtn}
              >
                {isPending ? 'Confirm in Wallet...' : 'Submit Score'}
              </button>
              
              {onCancel && (
                <button
                  onClick={onCancel}
                  disabled={isPending || isConfirming}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
