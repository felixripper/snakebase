import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://*.farcade.com https://gc.kis.v2.scr.kaspersky-labs.com wss://gc.kis.v2.scr.kaspersky-labs.com https://*.vercel.app https://*.vercel-preview.app; connect-src 'self' https://*.base.org https://*.farcade.com https://privy.farcaster.xyz https://cca-lite.coinbase.com https://*.vercel.app https://*.vercel-preview.app; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://gc.kis.v2.scr.kaspersky-labs.com wss://gc.kis.v2.scr.kaspersky-labs.com https://*.vercel.app https://*.vercel-preview.app; font-src 'self' https://fonts.gstatic.com; frame-ancestors *;"
          }
        ]
      },
      {
        source: '/eat-grow.html',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://*.farcade.com; connect-src 'self' https://*.base.org https://*.farcade.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'"
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
