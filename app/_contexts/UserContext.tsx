'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface User {
  id?: string;
  username?: string;
  walletAddress?: string;
  createdAt?: number;
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
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from session on mount
  useEffect(() => {
    loadUserFromSession();
  }, []);

  // Handle wallet connection changes
  useEffect(() => {
    if (isConnected && address) {
      handleWalletConnected(address);
    } else if (!isConnected) {
      setUser(null);
    }
  }, [address, isConnected]);

  const loadUserFromSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const sessionData = await response.json();
        if (sessionData.user) {
          setUser(sessionData.user);
        }
      }
    } catch (error) {
      console.error('Session yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnected = async (walletAddress: string) => {
    try {
      // Create or get user session
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: walletAddress.toLowerCase() }),
      });

      if (response.ok) {
        const sessionData = await response.json();
        setUser(sessionData.user);
      } else {
        console.error('Oturum oluşturulamadı');
      }
    } catch (error) {
      console.error('Cüzdan bağlantısı işlenirken hata:', error);
    }
  };

  const refreshUser = async () => {
    await loadUserFromSession();
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  const authenticated = !!user;

  return (
    <UserContext.Provider value={{
      user,
      loading,
      authenticated,
      refreshUser,
      logout,
    }}>
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
