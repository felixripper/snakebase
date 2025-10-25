'use client';
import { useEffect, useState } from 'react';

function truncateAddress(addr: string) {
  return addr.slice(0, 6) + '…' + addr.slice(-4);
}

export default function WalletBar() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Try to detect already connected accounts on load
  useEffect(() => {
    const detect = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eth = (window as any)?.ethereum;
        if (!eth) return;
        const accounts: string[] = await eth.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
        }
      } catch {
        // noop
      }
    };
    void detect();
  }, []);

  const connect = async () => {
    setConnecting(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const eth = (window as any)?.ethereum;
      if (!eth) {
        setError(
          'Cüzdan bulunamadı (window.ethereum yok). Lütfen MetaMask veya benzeri bir cüzdan kurun.'
        );
        return;
      }
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
      }
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
          {address ? (
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
                {truncateAddress(address)}
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
