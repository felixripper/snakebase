"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import styles from "../page.module.css";

export function GameFrame() {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const hasSignaledReadyRef = useRef(false);

  useEffect(() => {
    if (!isIframeLoaded || hasSignaledReadyRef.current) {
      return;
    }

    hasSignaledReadyRef.current = true;
    let isCancelled = false;

    const notifyReady = async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        const isMiniApp = (await sdk.isInMiniApp?.()) ?? false;

        if (!isMiniApp || isCancelled) {
          return;
        }

        await sdk.actions.ready();
      } catch (error) {
        console.error("Failed to notify Farcaster Mini App readiness", error);
        hasSignaledReadyRef.current = false;
      }
    };

    void notifyReady();

    return () => {
      isCancelled = true;
    };
  }, [isIframeLoaded]);

  const handleLoad = useCallback(() => {
    setIsIframeLoaded(true);
  }, []);

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
