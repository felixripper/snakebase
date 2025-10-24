import styles from "./page.module.css";

export default function Home() {
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
