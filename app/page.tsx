"use client";

import { useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import styles from "./page.module.css";

export default function Home() {
  const handleReady = useCallback(() => {
    void sdk.actions.ready();
  }, []);

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <iframe
        src="/eat-grow.html"
        title="Eat & Grow"
        className={styles.frame}
        allow="accelerometer; fullscreen"
        onLoad={handleReady}
      />
    </div>
  );
}
