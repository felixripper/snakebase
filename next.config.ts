import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://*.farcade.com https://gc.kis.v2.scr.kaspersky-labs.com wss://gc.kis.v2.scr.kaspersky-labs.com https://*.walletconnect.com https://*.walletconnect.org https://wrpcd.net https://*.wrpcd.net https://privy.farcaster.xyz https://privy.warpcast.com https://auth.privy.io https://*.rpc.privy.systems https://cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://gc.kis.v2.scr.kaspersky-labs.com wss://gc.kis.v2.scr.kaspersky-labs.com; img-src 'self' data: https:; connect-src 'self' https: wss: https://cca-lite.coinbase.com https://*.base.org https://*.farcade.com https://privy.farcaster.xyz https://privy.warpcast.com https://auth.privy.io https://*.rpc.privy.systems https://cloudflareinsights.com https://*.walletconnect.com https://*.walletconnect.org wss://*.walletconnect.com wss://*.walletconnect.org https://pulse.walletconnect.org https://explorer-api.walletconnect.com https://wrpcd.net https://*.wrpcd.net; frame-ancestors *;"
          }
        ]
      },
      {
        source: '/eat-grow.game',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; frame-ancestors *; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://*.farcade.com https://gc.kis.v2.scr.kaspersky-labs.com wss://gc.kis.v2.scr.kaspersky-labs.com https://*.walletconnect.com https://*.walletconnect.org https://wrpcd.net https://*.wrpcd.net https://privy.farcaster.xyz https://privy.warpcast.com https://auth.privy.io https://*.rpc.privy.systems https://cloudflareinsights.com; connect-src 'self' https://*.base.org https://*.farcade.com https://privy.farcaster.xyz https://privy.warpcast.com https://auth.privy.io https://*.rpc.privy.systems https://cloudflareinsights.com https://cca-lite.coinbase.com https://*.walletconnect.com https://*.walletconnect.org wss://*.walletconnect.com wss://*.walletconnect.org https://pulse.walletconnect.org https://explorer-api.walletconnect.com https://wrpcd.net https://*.wrpcd.net; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://gc.kis.v2.scr.kaspersky-labs.com wss://gc.kis.v2.scr.kaspersky-labs.com;"
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
