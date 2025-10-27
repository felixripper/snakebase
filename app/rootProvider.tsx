"use client";
import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { WagmiConfig, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";
import { UserProvider } from "./_contexts/UserContext";

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ?? ''}
          chain={base}
        >
          <UserProvider>
            {children}
          </UserProvider>
        </OnchainKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
