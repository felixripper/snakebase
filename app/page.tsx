"use client";

import { useEffect, useRef, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import styles from "./page.module.css";

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    void sdk.actions.ready();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.gameContainer}>
        {!loaded && !error && <div className={styles.loading}>Oyun yükleniyor...</div>}
        {error && <div className={styles.error}>Oyun yüklenirken hata oluştu. Lütfen sayfayı yenileyin.</div>}
        <iframe
          ref={iframeRef}
          src="/eat-grow.html"
          title="Eat & Grow"
          className={styles.frame}
          allow="accelerometer; fullscreen; camera; microphone; geolocation; autoplay; encrypted-media; gyroscope; magnetometer"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      </div>
    </div>
  );
}