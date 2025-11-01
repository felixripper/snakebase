"use client";
import { ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'viem/chains';
import { getConfig } from "../lib/config";
// Temporarily disabled UserProvider due to Wagmi dependency
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

// Theme Provider Component
function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const applyTheme = async () => {
      try {
        const config = await getConfig();
        if (config.theme) {
          const root = document.documentElement;

          // Sayfa arka planları
          root.style.setProperty('--page-bg', config.theme.pageBackground);
          root.style.setProperty('--page-bg-dark', config.theme.pageBackgroundDark);
          root.style.setProperty('--card-bg', config.theme.cardBackground);
          root.style.setProperty('--card-bg-dark', config.theme.cardBackgroundDark);

          // Yazı tipleri ve renkleri
          root.style.setProperty('--font-family', config.theme.fontFamily);
          root.style.setProperty('--heading-color', config.theme.headingColor);
          root.style.setProperty('--heading-color-dark', config.theme.headingColorDark);
          root.style.setProperty('--text-color', config.theme.textColor);
          root.style.setProperty('--text-color-dark', config.theme.textColorDark);
          root.style.setProperty('--muted-text-color', config.theme.mutedTextColor);
          root.style.setProperty('--muted-text-color-dark', config.theme.mutedTextColorDark);

          // Buton renkleri
          root.style.setProperty('--primary-btn-bg', config.theme.primaryButtonBg);
          root.style.setProperty('--primary-btn-text', config.theme.primaryButtonText);
          root.style.setProperty('--secondary-btn-bg', config.theme.secondaryButtonBg);
          root.style.setProperty('--secondary-btn-text', config.theme.secondaryButtonText);
          root.style.setProperty('--danger-btn-bg', config.theme.dangerButtonBg);
          root.style.setProperty('--danger-btn-text', config.theme.dangerButtonText);

          // Özel renkler
          root.style.setProperty('--accent-color', config.theme.accentColor);
          root.style.setProperty('--success-color', config.theme.successColor);
          root.style.setProperty('--warning-color', config.theme.warningColor);
          root.style.setProperty('--error-color', config.theme.errorColor);

          // Tasarım öğeleri
          root.style.setProperty('--border-radius', `${config.theme.borderRadius}px`);
          root.style.setProperty('--shadow-color', config.theme.shadowColor);
          root.style.setProperty('--shadow-color-dark', config.theme.shadowColorDark);
        }
      } catch (error) {
        console.error('Tema uygulanırken hata:', error);
      }
    };

    applyTheme();
  }, []);

  return <>{children}</>;
}

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          config={{
            appearance: {
              name: 'Snakebase',
              logo: '🐍',
              mode: 'auto',
              theme: 'default',
            },
          }}
        >
          <UserProvider>
            {children}
          </UserProvider>
        </OnchainKitProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
