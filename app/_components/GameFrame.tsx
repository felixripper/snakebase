"use client";

import { useEffect, useRef } from "react";

import styles from "../page.module.css";

export function GameFrame() {
  // We don't need to track iframe load state for functionality
  const hasSignaledReadyRef = useRef(false);

  // Call ready() immediately when component mounts
  useEffect(() => {
    if (hasSignaledReadyRef.current) {
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
  }, []); // No dependency on isIframeLoaded

  return (
    <div className={styles.container}>
      <iframe
        src="/eat-grow.html"
        title="Eat & Grow"
        className={styles.frame}
        allow="accelerometer; fullscreen"
      />
    </div>
  );
}
