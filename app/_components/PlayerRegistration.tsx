'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import styles from './PlayerRegistration.module.css';

const LEADERBOARD_ABI = [
  {
    inputs: [{ internalType: "string", name: "_username", type: "string" }],
    name: "registerPlayer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "string", name: "_username", type: "string" }],
    name: "isUsernameAvailable",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_player", type: "address" }],
    name: "isPlayerRegistered",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LEADERBOARD_CONTRACT as `0x${string}` || '0x0000000000000000000000000000000000000000';

export default function PlayerRegistration() {
  const { address, isConnected } = useAccount();
  const [username, setUsername] = useState('');
  const [checking, setChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  // Check if player is already registered
  const { data: isRegistered, refetch: refetchRegistration } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LEADERBOARD_ABI,
    functionName: 'isPlayerRegistered',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
    }
  });

  // Write contract hook
  const { data: hash, writeContract, isPending } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Check username availability
  const checkUsername = async () => {
    if (username.length < 3 || username.length > 20) {
      setUsernameAvailable(false);
      return;
    }

    setChecking(true);
    try {
      const available = await fetch('/api/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, contractAddress: CONTRACT_ADDRESS }),
      }).then(res => res.json());
      
      setUsernameAvailable(available.available);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(null);
    } finally {
      setChecking(false);
    }
  };

  const handleRegister = async () => {
    if (!username || username.length < 3 || username.length > 20) {
      alert('Kullanıcı adı 3-20 karakter arasında olmalıdır.');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: LEADERBOARD_ABI,
        functionName: 'registerPlayer',
        args: [username],
      });
    } catch (error) {
      console.error('Registration error:', error);
      alert('Kayıt sırasında bir hata oluştu.');
    }
  };

  // Handle successful registration
  if (isSuccess) {
    setTimeout(() => {
      refetchRegistration();
      window.location.reload();
    }, 2000);
  }

  if (!isConnected) {
    return (
      <div className={styles.container}>
        <div className={styles.notice}>
          <h3>🎮 Lider Tablosuna Katıl</h3>
          <p>Skorunu kaydetmek ve yarışmaya katılmak için önce cüzdanını bağla!</p>
        </div>
      </div>
    );
  }

  if (isRegistered) {
    return null; // Already registered, don&apos;t show registration form
  }

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.success}>
          <div className={styles.successIcon}>✅</div>
          <h3>Kayıt Başarılı!</h3>
          <p>Hoş geldin! Artık skorlarını kaydedebilir ve yarışabilirsin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3>🎮 Oyuncu Kaydı</h3>
        <p className={styles.description}>
          Lider tablosuna katılmak ve skorlarını kaydetmek için bir kullanıcı adı seç.
        </p>

        <div className={styles.formGroup}>
          <label htmlFor="username">Kullanıcı Adı</label>
          <div className={styles.inputWrapper}>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameAvailable(null);
              }}
              onBlur={checkUsername}
              placeholder="3-20 karakter"
              maxLength={20}
              className={styles.input}
              disabled={isPending || isConfirming}
            />
            {checking && <span className={styles.checking}>🔍</span>}
            {usernameAvailable === true && <span className={styles.available}>✅</span>}
            {usernameAvailable === false && <span className={styles.unavailable}>❌</span>}
          </div>
          {username.length > 0 && username.length < 3 && (
            <span className={styles.hint}>En az 3 karakter olmalı</span>
          )}
          {usernameAvailable === false && username.length >= 3 && (
            <span className={styles.error}>Bu kullanıcı adı alınmış</span>
          )}
          {usernameAvailable === true && (
            <span className={styles.success}>Kullanılabilir ✨</span>
          )}
        </div>

        <button
          onClick={handleRegister}
          disabled={!username || username.length < 3 || usernameAvailable === false || isPending || isConfirming}
          className={styles.registerBtn}
        >
          {isPending && 'Cüzdan Onayı Bekleniyor...'}
          {isConfirming && 'İşlem Onaylanıyor...'}
          {!isPending && !isConfirming && '🚀 Kayıt Ol'}
        </button>

        {(isPending || isConfirming) && (
          <div className={styles.processing}>
            <div className={styles.spinner}></div>
            <p>İşleminiz blockchain&apos;de onaylanıyor...</p>
          </div>
        )}
      </div>
    </div>
  );
}
