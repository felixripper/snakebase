'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

const blockchainEnabled = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENABLED === 'true';

interface User {
  id: string;
  username: string;
  walletAddress: string;
  createdAt: number;
  avatarUrl?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [_walletLoginBusy, _setWalletLoginBusy] = useState(false);
  const [sessionCache, setSessionCache] = useState<{ user: User | null; timestamp: number } | null>(null);
  const wagmiAccount = useAccount();
  const { address, isConnected } = blockchainEnabled ? wagmiAccount : { address: undefined, isConnected: false };
  const wagmiSignMessage = useSignMessage();
  const { signMessageAsync } = blockchainEnabled ? wagmiSignMessage : { signMessageAsync: undefined };

  const SESSION_CACHE_TTL = 60_000; // 60 seconds cache

  const refreshUser = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache first
      if (!forceRefresh && sessionCache && Date.now() - sessionCache.timestamp < SESSION_CACHE_TTL) {
        setUser(sessionCache.user);
        setAuthenticated(!!sessionCache.user);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (data.authenticated && data.user) {
        setUser(data.user);
        setAuthenticated(true);
        setSessionCache({ user: data.user, timestamp: Date.now() });
      } else {
        setUser(null);
        setAuthenticated(false);
        setSessionCache({ user: null, timestamp: Date.now() });
      }
    } catch (error) {
      console.error('Failed to fetch user session:', error);
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [sessionCache]);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout-user', { method: 'POST' });
      setUser(null);
      setAuthenticated(false);
      setSessionCache(null); // Clear cache on logout
      // Kullanıcı isteyerek çıktıysa kısa süreliğine otomatik cüzdan login'ini bastır
      if (typeof window !== 'undefined') {
        const until = Date.now() + 30_000; // 30 saniye
        try { sessionStorage.setItem('suppressWalletLoginUntil', String(until)); } catch {}
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Auto wallet-only login: if wallet connects and no app session, do SIWE-lite
  useEffect(() => {
    if (!blockchainEnabled) return; // Skip wallet login if blockchain disabled
    const run = async () => {
      try {
        if (!isConnected || !address) return;

        // Kullanıcı yakın zamanda manuel logout yaptıysa bekle
        const untilStr = typeof window !== 'undefined' ? sessionStorage.getItem('suppressWalletLoginUntil') : null;
        const until = untilStr ? Number(untilStr) : 0;
        if (until && Date.now() < until) return;

        // If we already have an app session, skip signing
        const resp = await fetch('/api/auth/session');
        const ds = await resp.json().catch(() => ({}));
        if (ds?.authenticated) {
          await refreshUser(true);
          return;
        }

        // Perform SIWE-lite: request nonce, sign message, verify
        if (typeof signMessageAsync === 'function') {
          try {
            const nonceRes = await fetch('/api/auth/wallet/nonce', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ address }),
            });
            const nonceData = await nonceRes.json();
            if (!nonceData?.message) {
              // fallback to refreshUser which may show anonymous
              await refreshUser(true);
              return;
            }

            const message = nonceData.message as string;
            const signature = await signMessageAsync({ message });

            const verifyRes = await fetch('/api/auth/wallet/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ address, signature }),
            });
            const verifyData = await verifyRes.json().catch(() => ({}));
            if (verifyData?.success) {
              await refreshUser(true);
            } else {
              // verification failed — still refresh to clear any stale session
              await refreshUser(true);
            }
          } catch {
            // ignore signing errors but refresh user state
            await refreshUser(true);
          }
        } else {
          // No signer available — just refresh
          await refreshUser(true);
        }
      } catch {
        // ignore
      }
    };
    run();
  }, [isConnected, address, authenticated, signMessageAsync, _walletLoginBusy, refreshUser]);

  return (
    <UserContext.Provider value={{ user, loading, authenticated, refreshUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
