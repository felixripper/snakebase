# SnakeBase - Blockchain Snake Game

A snake game with blockchain integration, admin panel, and dynamic configuration via Vercel KV.

## Features

- 🎮 Classic snake game with customizable colors, speed, and scoring
- 🔐 Admin panel with authentication (iron-session)
- ⚙️ Live configuration updates (Vercel KV Redis storage)
- 🔗 OnchainKit wallet integration
- 🧪 Full testing suite (Jest, Playwright, Foundry/Anvil)
- 🚀 CI/CD with GitHub Actions

## Prerequisites

- Node.js >=18 <21
- npm or yarn
- Vercel account (for deployment)
- Coinbase Developer Platform API Key (optional, for better rate limits)

## Local Development

1. **Clone and install dependencies:**

```bash
git clone https://github.com/felixripper/snakebase.git
cd snakebase
npm install
```

2. **Configure environment variables:**

Create `.env.local`:

```bash
# Required for admin authentication
SECRET_COOKIE_PASSWORD=your-secret-password-min-32-chars
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# Optional - OnchainKit API key for better rate limits
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-cdp-api-key
```

3. **Start development server:**

```bash
npm run dev
```

Game: http://localhost:3000  
Admin: http://localhost:3000/admin/settings

## Testing

```bash
# Unit tests
npm test

# E2E tests (requires Anvil blockchain)
npm run test:blockchain
npm run test:e2e

# Linting
npm run lint
```

## Deployment to Vercel

### 1. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/felixripper/snakebase)

Or via CLI:

```bash
npm install -g vercel
vercel
```

### 2. **CRITICAL: Enable Vercel KV Storage**

Admin panel config **will not persist** without Vercel KV:

1. Go to your project dashboard on Vercel
2. Navigate to **Storage** tab
3. Click **Create Database** → **KV**
4. Choose a name (e.g., `snakebase-config`)
5. Click **Create**
6. Vercel automatically injects `KV_*` environment variables

Without Vercel KV, each serverless function starts with default config.

### 3. Configure Environment Variables

In Vercel project settings → **Environment Variables**, add:

```bash
# Required
SECRET_COOKIE_PASSWORD=your-secret-password-min-32-chars
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# Optional
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-cdp-api-key
```

### 4. Redeploy

After adding KV and env vars, trigger a redeploy:

```bash
vercel --prod
```

Or push to `main` branch to auto-deploy.

## Admin Panel Usage

1. Navigate to `/admin/settings`
2. Login with `ADMIN_USERNAME` and `ADMIN_PASSWORD`
3. Customize game appearance and behavior
4. Click **Save Settings**
5. Changes apply immediately (Vercel KV required in production)

## Architecture

### Config Storage

- **Development:** In-memory fallback (resets on restart)
- **Production:** Vercel KV (Redis) for persistence
- **Shared store:** `lib/config-store.ts` used by both `/api/config` (admin) and `/api/game-config` (game)

### Authentication

- `iron-session` for secure session cookies
- Middleware protection on `/admin/*` routes
- Environment-based credentials

### Tech Stack

- **Framework:** Next.js 15 App Router
- **Blockchain:** OnchainKit, Farcaster MiniKit, Foundry
- **Storage:** Vercel KV (Redis)
- **Testing:** Jest, Playwright, OnchainTestKit
- **CI/CD:** GitHub Actions, Husky
- **Monitoring:** Sentry

## Troubleshooting

### Admin changes don't affect game

**Cause:** Vercel KV not configured  
**Solution:** Follow [step 2](#2-critical-enable-vercel-kv-storage) above

### Session errors on Vercel

**Cause:** `SECRET_COOKIE_PASSWORD` not set or too short  
**Solution:** Must be at least 32 characters

### Build errors with Hardhat artifacts

**Cause:** TypeScript trying to compile e2e tests  
**Solution:** Already excluded in `tsconfig.json`

## License

MIT

## Contributing

PRs welcome! Please run tests before submitting:

```bash
npm run lint
npm test
npm run test:blockchain
```
