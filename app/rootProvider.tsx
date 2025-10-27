"use client";
import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { WagmiConfig, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";
import { UserProvider } from "./_contexts/UserContext";

const queryClient = new QueryClient();

const blockchainEnabled = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENABLED === 'true';

// Create wagmi config only if blockchain features are enabled.
const wagmiConfig = blockchainEnabled
  ? createConfig({
      chains: [base],
      transports: {
        [base.id]: http(),
      },
    })
  : undefined;

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {blockchainEnabled && wagmiConfig ? (
        <WagmiConfig config={wagmiConfig}>
          <OnchainKitProvider apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ?? ''} chain={base}>
            <UserProvider>{children}</UserProvider>
          </OnchainKitProvider>
        </WagmiConfig>
      ) : (
        // If blockchain is disabled, don't render Wagmi/OnchainKit providers.
        <UserProvider>{children}</UserProvider>
      )}
    </QueryClientProvider>
  );
}
