'use client';
import { useEffect, useState } from 'react';
import { useUser } from '../_contexts/UserContext';
import Link from 'next/link';
import { useAccount } from 'wagmi';

function truncateAddress(addr: string) {
  return addr.slice(0, 6) + '…' + addr.slice(-4);
}

export default function WalletBar() {
  const { user, authenticated, refreshUser } = useUser();
  const { address: wagmiAddress, isConnected } = useAccount();
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMiniApp, setIsMiniApp] = useState(false);

  // MiniApp ortamını algıla ve mevcut hesapları tespit et
  useEffect(() => {
    let cancelled = false;
    const detect = async () => {
      try {
        // Farcaster Mini App
        const { sdk } = await import('@farcaster/miniapp-sdk');
        const inside = (await sdk.isInMiniApp?.()) ?? false;
        if (!cancelled) setIsMiniApp(inside);

        // Tarayıcı cüzdanı (fallback)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eth = (window as any)?.ethereum;
        if (eth?.request) {
          const accounts: string[] = await eth.request({ method: 'eth_accounts' });
          if (!cancelled && accounts && accounts.length > 0) {
            setAddress(accounts[0]);
          }
        }
      } catch {
        // noop
      }
    };
    void detect();
    return () => { cancelled = true; };
  }, []);

  const connect = async () => {
    setConnecting(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const eth = (window as any)?.ethereum;
      if (eth?.request) {
        const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) setAddress(accounts[0]);
        return;
      }
      if (isMiniApp) {
        setError('Farcaster Base App içinde cüzdan bağlantısı uygulama tarafından yönetilir. Oyun sırasında yetki istenebilir.');
        return;
      }
      setError('Cüzdan bulunamadı. Lütfen MetaMask kurun veya Base App içinde açın.');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Bağlantı hatası');
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    // Tarayıcı cüzdanlarında programatik disconnect çoğu zaman desteklenmez.
    // Uygulama durumunu sıfırlıyoruz.
    setAddress(null);
    setError(null);
  };

  // Kullanıcı login ise ve cüzdan adresi varsa otomatik linkle
  const effectiveAddress = wagmiAddress ?? address;
  useEffect(() => {
    const run = async () => {
      try {
        if (!authenticated || !user || !effectiveAddress) return;
        if (user.walletAddress && user.walletAddress.toLowerCase() === effectiveAddress.toLowerCase()) return;
        const res = await fetch('/api/auth/link-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: effectiveAddress })
        });
        if (res.ok) {
          await refreshUser();
        }
      } catch {
        // ignore
      }
    };
    void run();
  }, [authenticated, user, effectiveAddress, refreshUser]);

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'saturate(180%) blur(6px)',
        color: '#fff',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div
        style={{
          maxWidth: 1024,
          margin: '0 auto',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          fontSize: 14,
        }}
      >
        <div style={{ opacity: 0.9 }}>OnchainKit Wallet</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {authenticated && user && (
            <Link
              href="/account"
              style={{
                color: '#fff',
                textDecoration: 'none',
                padding: '6px 12px',
                background: 'rgba(102, 126, 234, 0.3)',
                borderRadius: 8,
                border: '1px solid rgba(102, 126, 234, 0.5)',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              👤 {user.username}
            </Link>
          )}
          {!authenticated && (
            <>
              <Link
                href="/signin"
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Giriş
              </Link>
              <Link
                href="/register"
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  background: 'rgba(102, 126, 234, 0.5)',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Kayıt Ol
              </Link>
            </>
          )}
          
          {(isConnected || !!effectiveAddress) ? (
            <>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(255,255,255,0.1)',
                  padding: '6px 10px',
                  borderRadius: 8,
                }}
              >
                <span
                  aria-label="connected"
                  title="Connected"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: '#22c55e',
                    display: 'inline-block',
                  }}
                />
                {effectiveAddress ? truncateAddress(effectiveAddress) : 'Connected'}
              </span>
              <button
                type="button"
                onClick={disconnect}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  padding: '6px 10px',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={connect}
              disabled={connecting}
              style={{
                background: '#3b82f6',
                color: '#fff',
                border: 0,
                padding: '8px 12px',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {connecting ? 'Bağlanıyor…' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
      {error ? (
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 12px 8px' }}>
          <div
            role="alert"
            style={{
              marginTop: 6,
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.35)',
              color: '#fecaca',
              padding: '8px 10px',
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        </div>
      ) : null}
    </div>
  );
}
