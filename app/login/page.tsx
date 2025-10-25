"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Başarılı girişten sonra admin paneline yönlendir
        router.push('/admin');
      } else {
        const data = await response.json();
        setError(data.message || 'Giriş başarısız.');
      }
    } catch (err) {
      // Hata değişkenini kullanmadığımız için ESLint kuralını burada devre dışı bırakıyoruz.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setError('Bir sunucu hatası oluştu.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>Admin Paneli Girişi</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Kullanıcı Adı</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Şifre</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" className={styles.button}>Giriş Yap</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
