"use client";

import { useState } from "react";
import Link from "next/link";
// Temporarily disabled OnchainKit wallet
// import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import styles from "../page.module.css";

export default function LoginPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className={styles.loginContainer}>
      {/* Background Effects */}
      <div className={styles.bgEffects}>
        <div className={styles.bgGradient}></div>
        <div className={styles.floatingShapes}>
          <div className={styles.shape1}>🐍</div>
          <div className={styles.shape2}>🍎</div>
          <div className={styles.shape3}>⭐</div>
          <div className={styles.shape4}>🎮</div>
        </div>
      </div>

      {/* Header */}
      <header className={styles.loginHeader}>
        <div className={styles.logo}>
          <h1 className={styles.logoText}>Snakebase</h1>
          <div className={styles.logoSubtitle}>Base Ağında Blockchain Snake</div>
        </div>
        <div className={styles.headerActions}>
          <Link href="/eat-grow.html" className={styles.skipLink}>
            Oyunu Görüntüle →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.loginMain}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>
              Blockchain&apos;de
              <span className={styles.heroHighlight}> Snake </span>
              Oyna
            </h2>
            <p className={styles.heroDescription}>
              Base ağında yılanını büyüt, skorunu kaydet ve liderlik tablosunda yerini al!
              {/* OnchainKit ile güvenli cüzdan entegrasyonu. */}
            </p>

            <div className={styles.heroFeatures}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🏆</div>
                <span>Onchain Liderlik</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>⚡</div>
                <span>Anlık Skor Kaydı</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🎨</div>
                <span>Özelleştirilebilir</span>
              </div>
            </div>

            <div className={styles.heroActions}>
              {/* Temporarily disabled wallet connection */}
              {/* <ConnectWallet /> */}
              <button className={styles.playButton} onClick={() => window.location.href = '/eat-grow.html'}>
                <span className={styles.playIcon}>🎮</span>
                Şimdi Oyna
              </button>
              <Link href="/eat-grow.html" className={styles.quickPlayLink}>Hızlı Oyna →</Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.gamePreview}>
              <div className={styles.previewScreen}>
                <div className={styles.snakeDemo}>
                  <div className={styles.demoSnake}>
                    <div className={styles.snakeHead}>🐸</div>
                    <div className={styles.snakeBody}></div>
                    <div className={styles.snakeBody}></div>
                    <div className={styles.snakeBody}></div>
                  </div>
                  <div className={styles.demoFood}>🍎</div>
                </div>
                <div className={styles.scoreDemo}>
                  <div className={styles.scoreText}>Skor: 1,247</div>
                </div>
              </div>
              <div className={styles.previewGlow}></div>
            </div>
          </div>
        </div>

        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>10K+</div>
              <div className={styles.statLabel}>Toplam Oyun</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Aktif Oyuncu</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Toplam Skor</div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.loginFooter}>
        <div className={styles.footerContent}>
          <div className={styles.footerLinks}>
            <a href="/about">Hakkında</a>
            <a href="/privacy">Gizlilik</a>
            <a href="/terms">Koşullar</a>
          </div>
          <div className={styles.footerText}>© 2025 Snakebase. Base ağında güçlendirildi.</div>
        </div>
      </footer>
    </div>
  );
}

  return (
    <div className={styles.loginContainer}>
      {/* Background Effects */}
      <div className={styles.bgEffects}>
        <div className={styles.bgGradient}></div>
        <div className={styles.floatingShapes}>
          <div className={styles.shape1}>🐍</div>
          <div className={styles.shape2}>🍎</div>
          <div className={styles.shape3}>⭐</div>
          <div className={styles.shape4}>🎮</div>
        </div>
      </div>

      {/* Header */}
      <header className={styles.loginHeader}>
        <div className={styles.logo}>
          <h1 className={styles.logoText}>Snakebase</h1>
          <div className={styles.logoSubtitle}>Base Ağında Blockchain Snake</div>
        </div>
        <div className={styles.headerActions}>
          <Link href="/" className={styles.skipLink}>
            Oyunu Görüntüle →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.loginMain}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>
              Blockchain&apos;de
              <span className={styles.heroHighlight}> Snake </span>
              Oyna
            </h2>
            <p className={styles.heroDescription}>
              Base ağında yılanını büyüt, skorunu kaydet ve liderlik tablosunda yerini al!
              OnchainKit ile güvenli cüzdan entegrasyonu.
            </p>

            <div className={styles.heroFeatures}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🏆</div>
                <span>Onchain Liderlik</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>⚡</div>
                <span>Anlık Skor Kaydı</span>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🎨</div>
                <span>Özelleştirilebilir</span>
              </div>
            </div>

            <div className={styles.heroActions}>
              <button
                className={styles.playButton}
                onClick={() => setShowLoginModal(true)}
              >
                <span className={styles.playIcon}>🎮</span>
                Şimdi Oyna
              </button>

              <Link href="/game" className={styles.quickPlayLink}>
                Hızlı Oyna →
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.gamePreview}>
              <div className={styles.previewScreen}>
                <div className={styles.snakeDemo}>
                  <div className={styles.demoSnake}>
                    <div className={styles.snakeHead}>🐸</div>
                    <div className={styles.snakeBody}></div>
                    <div className={styles.snakeBody}></div>
                    <div className={styles.snakeBody}></div>
                  </div>
                  <div className={styles.demoFood}>🍎</div>
                </div>
                <div className={styles.scoreDemo}>
                  <div className={styles.scoreText}>Skor: 1,247</div>
                </div>
              </div>
              <div className={styles.previewGlow}></div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>10K+</div>
              <div className={styles.statLabel}>Toplam Oyun</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Aktif Oyuncu</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Toplam Skor</div>
            </div>
          </div>
        </section>
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className={styles.modalOverlay} onClick={() => setShowLoginModal(false)}>
          <div className={styles.loginModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Oyuna Başla</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowLoginModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.walletSection}>
                <h4>Cüzdan Bağlantısı</h4>
                <p>Skorlarınızı kaydetmek için cüzdanınızı bağlayın</p>
                <div className={styles.walletConnect}>
                  <ConnectWallet />
                </div>
              </div>

              <div className={styles.divider}>
                <span>veya</span>
              </div>

              <div className={styles.guestSection}>
                <h4>Misafir Olarak Oyna</h4>
                <p>Skorlar kaydedilmeyecek</p>
                <Link href="/game" className={styles.guestButton}>
                  Misafir Girişi
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.loginFooter}>
        <div className={styles.footerContent}>
          <div className={styles.footerLinks}>
            <Link href="/about">Hakkında</Link>
            <Link href="/privacy">Gizlilik</Link>
            <Link href="/terms">Koşullar</Link>
          </div>
          <div className={styles.footerText}>
            © 2025 Snakebase. Base ağında güçlendirildi.
          </div>
        </div>
      </footer>
    </div>
  );
}