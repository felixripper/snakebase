"use client";
import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { WagmiConfig, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./_contexts/UserContext";
import { injected } from "wagmi/connectors";
import { coinbaseWallet } from "@wagmi/connectors";

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

const blockchainEnabled = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENABLED === 'true';

// Create wagmi config only if blockchain features are enabled.
const wagmiConfig = blockchainEnabled
  ? createConfig({
      chains: [base],
      transports: {
        [base.id]: http(),
      },
      connectors: [
        injected(),
        coinbaseWallet({
          appName: 'Snakebase',
          appLogoUrl: 'https://snakebase.vercel.app/favicon.ico',
        }),
      ],
      batch: {
        multicall: true,
      },
    })
  : undefined;

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {blockchainEnabled && wagmiConfig ? (
        <WagmiConfig config={wagmiConfig}>
          <UserProvider>{children}</UserProvider>
        </WagmiConfig>
      ) : (
        // If blockchain is disabled, don't render Wagmi/OnchainKit providers.
        <UserProvider>{children}</UserProvider>
      )}
    </QueryClientProvider>
  );
}
