'use client';

import { useUser } from '../_contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import styles from './Account.module.css';

export default function AccountPage() {
  const { user, loading, authenticated, logout, refreshUser } = useUser();
  const { address: walletAddress } = useAccount();
  const router = useRouter();
  const [linkingWallet, setLinkingWallet] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push('/signin');
    }
  }, [loading, authenticated, router]);

  const handleLinkWallet = async () => {
    if (!walletAddress) {
      setMessage('Lütfen önce cüzdanınızı bağlayın');
      return;
    }

    setLinkingWallet(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/link-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Cüzdan başarıyla bağlandı!');
        await refreshUser();
      } else {
        setMessage(data.message || 'Cüzdan bağlama başarısız');
      }
    } catch (error) {
      console.error('Link wallet error:', error);
      setMessage('Bir hata oluştu');
    } finally {
      setLinkingWallet(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className={styles.container}>
      <div className={styles.accountBox}>
        <h1>Hesabım</h1>

        <div className={styles.section}>
          <h2>Profil Bilgileri</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Kullanıcı Adı:</label>
              <span>{user.username}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Üyelik Tarihi:</label>
              <span>{new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Cüzdan Bağlantısı</h2>
          {user.walletAddress ? (
            <div className={styles.walletConnected}>
              <div className={styles.walletIcon}>✅</div>
              <div>
                <p className={styles.walletLabel}>Bağlı Cüzdan:</p>
                <p className={styles.walletAddress}>
                  {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.walletNotConnected}>
              <p className={styles.walletInfo}>
                Blockchain özelliklerini kullanmak için cüzdanınızı bağlayın
              </p>
              {walletAddress ? (
                <div>
                  <p className={styles.currentWallet}>
                    Mevcut Cüzdan: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                  <button
                    onClick={handleLinkWallet}
                    className={styles.linkButton}
                    disabled={linkingWallet}
                  >
                    {linkingWallet ? 'Bağlanıyor...' : 'Cüzdanı Bağla'}
                  </button>
                </div>
              ) : (
                <p className={styles.connectPrompt}>
                  Lütfen üst menüden cüzdanınızı bağlayın
                </p>
              )}
            </div>
          )}
          {message && <div className={styles.message}>{message}</div>}
        </div>

        <div className={styles.actions}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}
