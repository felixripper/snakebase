import type { Metadata } from 'next';
import { minikitConfig } from '../minikit.config';
import { RootProvider } from './rootProvider';
import './globals.css';
import WalletBar from './_components/WalletBar';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: minikitConfig.miniapp.name,
    description: minikitConfig.miniapp.description,
    other: {
      'fc:frame': JSON.stringify({
        version: minikitConfig.miniapp.version,
        imageUrl: minikitConfig.miniapp.heroImageUrl,
        button: {
          title: `Play the ${minikitConfig.miniapp.name} on Base`,
          action: {
            name: `Launch ${minikitConfig.miniapp.name}`,
            type: 'launch_frame',
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootProvider>
      <html lang="en">
        <body>
          <WalletBar />
          {children}
        </body>
      </html>
    </RootProvider>
  );
}
