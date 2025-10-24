import React, { useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  useEffect(() => {
    // Try to call the SDK ready action if the SDK is available at runtime.
    // Use globalThis to avoid TypeScript/SSR issues if sdk isn't defined during build.
    try {
      const s = (globalThis as any).sdk ?? (globalThis as any).FarcadeSDK ?? null;
      if (s && typeof s.actions?.ready === "function") {
        void s.actions.ready();
      }
    } catch (e) {
      // swallow any errors here so the page doesn't break if SDK is missing
      // (use console.debug so it's visible in dev tools when present)
      console.debug("SDK not available or ready failed:", e);
    }
  }, []);

  return (
    <div className={styles.container}>
      <iframe
        src="/eat-grow.html"
        title="Eat and Grow"
        style={{ border: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}