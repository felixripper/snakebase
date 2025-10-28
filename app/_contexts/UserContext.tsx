'use client';

import { createContext, useContext, ReactNode } from 'react';

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

const noopContext: UserContextType = {
  user: null,
  loading: false,
  authenticated: false,
  refreshUser: async () => {},
  logout: async () => {},
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  return <UserContext.Provider value={noopContext}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    // Return noop to avoid breaking callers outside of provider in tests
    return noopContext;
  }
  return context;
}
