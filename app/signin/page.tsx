'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './SignIn.module.css';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: '', // Email or username
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login successful, redirect to home
        router.push('/?signin=success');
      } else {
        setError(data.message || 'Giriş başarısız');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Bağlantı hatası oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.signInBox}>
        <h1>Giriş Yap</h1>
        <p className={styles.subtitle}>Hesabınıza giriş yapın</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="identifier">Email veya Kullanıcı Adı</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              placeholder="email@ornek.com veya kullaniciadi"
              autoComplete="username"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <div className={styles.options}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>Beni hatırla</span>
            </label>
            <Link href="/forgot-password" className={styles.forgotLink}>
              Şifremi unuttum
            </Link>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>veya</span>
        </div>

        <div className={styles.walletConnect}>
          <p className={styles.walletText}>Cüzdan ile bağlan</p>
          <button className={styles.walletButton} onClick={() => router.push('/')}>
            🦊 MetaMask ile Bağlan
          </button>
        </div>

        <div className={styles.footer}>
          <p>
            Hesabınız yok mu?{' '}
            <Link href="/register" className={styles.link}>
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
