"use client";

import { useCallback, useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import styles from "./page.module.css";

export default function Home() {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  useEffect(() => {
    if (!isIframeLoaded) return;
    void sdk.actions.ready();
  }, [isIframeLoaded]);

  const handleLoad = useCallback(() => {
    setIsIframeLoaded(true);
  }, []);

export default function Home() {
  return (
    <div className={styles.container}>
      <iframe
        src="/eat-grow.html"
        title="Eat & Grow"
        className={styles.frame}
        allow="accelerometer; fullscreen"
        onLoad={handleLoad}
      />
    </div>
  );
}
