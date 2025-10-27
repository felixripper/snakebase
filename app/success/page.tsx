"use client";

import { minikitConfig } from "../../minikit.config";
import styles from "./page.module.css";

export default function Success() {

  const handleShare = async () => {
    try {
      const text = `Yay! I just joined the waitlist for ${minikitConfig.miniapp.name.toUpperCase()}! `;

      // Fallback: use navigator.share if available, otherwise copy to clipboard
      if (navigator.share) {
        await navigator.share({
          title: 'Snakebase Success',
          text: text,
          url: process.env.NEXT_PUBLIC_URL || ""
        });
      } else {
        await navigator.clipboard.writeText(text + (process.env.NEXT_PUBLIC_URL || ""));
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} type="button">
        ✕
      </button>
      
      <div className={styles.content}>
        <div className={styles.successMessage}>
          <div className={styles.checkmark}>
            <div className={styles.checkmarkCircle}>
              <div className={styles.checkmarkStem}></div>
              <div className={styles.checkmarkKick}></div>
            </div>
          </div>
          
          <h1 className={styles.title}>Welcome to the {minikitConfig.miniapp.name.toUpperCase()}!</h1>
          
          <p className={styles.subtitle}>
            You&apos;re in! We&apos;ll notify you as soon as we launch.<br />
            Get ready to experience the future of onchain marketing.
          </p>

          <button onClick={handleShare} className={styles.shareButton}>
            SHARE
          </button>
        </div>
      </div>
    </div>
  );
}
