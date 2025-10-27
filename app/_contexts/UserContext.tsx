'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

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
  const [walletLoginBusy, setWalletLoginBusy] = useState(false);
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (data.authenticated && data.user) {
        setUser(data.user);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to fetch user session:', error);
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout-user', { method: 'POST' });
      setUser(null);
      setAuthenticated(false);
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
  }, []);

  // Auto wallet-only login: if wallet connects and no app session, do SIWE-lite
  useEffect(() => {
    const run = async () => {
      try {
        if (!isConnected || !address) return;

        // Kullanıcı yakın zamanda manuel logout yaptıysa bekle
        try {
          const untilStr = typeof window !== 'undefined' ? sessionStorage.getItem('suppressWalletLoginUntil') : null;
          const until = untilStr ? Number(untilStr) : 0;
          if (until && Date.now() < until) return;
        } catch {}
        if (authenticated || walletLoginBusy) return;
        setWalletLoginBusy(true);

        // 1) Get nonce
        const res1 = await fetch('/api/auth/wallet/nonce', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address })
        });
        if (!res1.ok) return;
        const n = await res1.json();
        if (!n?.message) return;

        // 2) Ask signature
        const signature = await signMessageAsync({ message: n.message });

        // 3) Verify
        const res2 = await fetch('/api/auth/wallet/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, signature })
        });
        if (res2.ok) await refreshUser();
      } catch {
        // kullanıcı imzayı reddedebilir; sessiz geç
      } finally {
        setWalletLoginBusy(false);
      }
    };
    void run();
  }, [isConnected, address, authenticated, signMessageAsync, walletLoginBusy]);

  return (
    <UserContext.Provider value={{ user, loading, authenticated, refreshUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
