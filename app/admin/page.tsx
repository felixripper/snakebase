"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import styles from "./Admin.module.css";

type GameConfig = {
  snakeSpeed: number;
  snakeColor: string;
  foodColor: string;
  backgroundColor: string;
  pointsPerFood: number;
  interfaceTitle: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [config, setConfig] = useState<Partial<GameConfig>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Ayarlar yüklenemedi.");
        setIsLoading(false);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("Kaydediliyor...");
    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage("Ayarlar başarıyla kaydedildi!");
      } else {
        throw new Error(result.message || "Bir hata oluştu.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Hata: ${error.message}`);
      } else {
        setMessage("Bilinmeyen bir hata oluştu.");
      }
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = async () => {
    await fetch('/api/logout');
    router.push('/login');
  };

  if (isLoading) {
    return <div className={styles.container}><h1>Yükleniyor...</h1></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Oyun Ayarları Paneli</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>Çıkış Yap</button>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="interfaceTitle">Oyun Başlığı</label>
          <input type="text" id="interfaceTitle" name="interfaceTitle" value={config.interfaceTitle || ""} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="snakeSpeed">Yılan Hızı</label>
          <input type="number" id="snakeSpeed" name="snakeSpeed" value={config.snakeSpeed || 10} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="pointsPerFood">Yem Başına Puan</label>
          <input type="number" id="pointsPerFood" name="pointsPerFood" value={config.pointsPerFood || 10} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="snakeColor">Yılan Rengi</label>
          <input type="color" id="snakeColor" name="snakeColor" value={config.snakeColor || "#34C759"} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="foodColor">Yem Rengi</label>
          <input type="color" id="foodColor" name="foodColor" value={config.foodColor || "#FF3B30"} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="backgroundColor">Arkaplan Rengi</label>
          <input type="color" id="backgroundColor" name="backgroundColor" value={config.backgroundColor || "#000000"} onChange={handleInputChange} />
        </div>
        <button type="submit" className={styles.button}>Ayarları Kaydet</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
