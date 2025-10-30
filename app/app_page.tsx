"use client";

import { useEffect, useRef } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import styles from "./page.module.css";

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    void sdk.actions.ready();
  }, []);

  return (
    <div className={styles.container}>
      <iframe
        ref={iframeRef}
        src="/static/eat-grow.html"
        title="Eat & Grow"
        className={styles.frame}
        allow="accelerometer; fullscreen; camera; microphone; geolocation; autoplay; encrypted-media; gyroscope; magnetometer"
      />
    </div>
  );
}