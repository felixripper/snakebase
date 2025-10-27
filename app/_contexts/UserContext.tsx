'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useCallback } from 'react';
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
  const [_walletLoginBusy, _setWalletLoginBusy] = useState(false);
  const [sessionCache, setSessionCache] = useState<{ user: User | null; timestamp: number } | null>(null);
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

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
    const run = async () => {
      try {
        if (!isConnected || !address) return;

        // Kullanıcı yakın zamanda manuel logout yaptıysa bekle
        const untilStr = typeof window !== 'undefined' ? sessionStorage.getItem('suppressWalletLoginUntil') : null;
        const until = untilStr ? Number(untilStr) : 0;
        if (until && Date.now() < until) return;

        await refreshUser(true);
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
