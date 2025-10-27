'use client';

import { useUser } from '../_contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './Account.module.css';

export default function AccountPage() {
  const { user, loading, authenticated, logout, refreshUser } = useUser();
  const router = useRouter();
  const [message, setMessage] = useState('');

  // Username editing
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push('/');
    }
  }, [loading, authenticated, router]);

  const handleUsernameSubmit = async () => {
    if (!newUsername.trim()) {
      setUsernameError('Username cannot be empty');
      return;
    }
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditingUsername(false);
        setUsernameError('');
        setMessage('Username updated successfully!');
        await refreshUser();
      } else {
        setUsernameError(data.error || 'Failed to update username');
      }
    } catch {
      setUsernameError('Network error');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Image must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);
    setAvatarError('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Avatar updated successfully!');
        await refreshUser();
      } else {
        setAvatarError(data.error || 'Failed to upload avatar');
      }
    } catch {
      setAvatarError('Network error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.accountBox}>
        <h1>Account</h1>

        <div className={styles.section}>
          <h2>Profile</h2>
          
          {/* Avatar Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  cursor: 'pointer',
                }}
                onClick={() => fileInputRef.current?.click()}
                title="Click to change avatar"
              >
                {user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt="Avatar" width={128} height={128} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  '👤'
                )}
              </div>
              {uploadingAvatar && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>
                  ⏳
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarUpload}
              />
            </div>
            <div style={{ flex: 1 }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={styles.linkButton}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
              </button>
              {avatarError && <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{avatarError}</div>}
            </div>
          </div>

          {/* Username Section */}
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Username:</label>
              {isEditingUsername ? (
                <div>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                    style={{ padding: 8, fontSize: 14, borderRadius: 4, border: '1px solid #ccc', marginRight: 8 }}
                  />
                  <button onClick={handleUsernameSubmit} style={{ padding: '6px 12px', fontSize: 13, cursor: 'pointer', marginRight: 4 }}>
                    Save
                  </button>
                  <button onClick={() => { setIsEditingUsername(false); setUsernameError(''); }} style={{ padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  {usernameError && <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{usernameError}</div>}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{user.username}</span>
                  <button
                    onClick={() => { setIsEditingUsername(true); setNewUsername(user.username); }}
                    style={{ padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}
                  >
                    ✏️ Edit
                  </button>
                </div>
              )}
            </div>
            <div className={styles.infoItem}>
              <label>Wallet Address:</label>
              <span>{user.walletAddress?.slice(0, 6)}...{user.walletAddress?.slice(-4)}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Member Since:</label>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {message && <div className={styles.message}>{message}</div>}
        </div>

        <div className={styles.actions}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
