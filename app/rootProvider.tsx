"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Temporarily disabled OnchainKit due to dependency conflicts
// import { OnchainKitProvider } from '@coinbase/onchainkit';
// import { base } from 'viem/chains';
import { UserProvider } from "./_contexts/UserContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 429 (rate limit) errors
        if (error && typeof error === 'object' && 'status' in error && error.status === 429) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Temporarily disabled OnchainKit */}
      {/* <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={base}
      > */}
        <UserProvider>
          {children}
        </UserProvider>
      {/* </OnchainKitProvider> */}
    </QueryClientProvider>
  );
}
