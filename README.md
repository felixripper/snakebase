# Waitlist Mini App Quickstart

This is a demo Mini App application built using OnchainKit and the Farcaster SDK. Build a waitlist sign-up mini app for your company that can be published to the Base app and Farcaster. 

> [!IMPORTANT]  
> Before interacting with this demo, please review our [disclaimer](#disclaimer) — there are **no official tokens or apps** associated with Cubey, Base, or Coinbase.

## Prerequisites

Before getting started, make sure you have:

* Base app account
* A [Farcaster](https://farcaster.xyz/) account
* [Vercel](https://vercel.com/) account for hosting the application
* [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) Client API Key

## Getting Started

### 1. Clone this repository 

```bash
git clone https://github.com/base/demos.git
```

### 2. Install dependencies:

```bash
cd demos/minikit/waitlist-mini-app-qs
npm install
```

### 3. Configure environment variables

Create a `.env.local` file and add your environment variables:

```bash
NEXT_PUBLIC_PROJECT_NAME="Your App Name"
NEXT_PUBLIC_ONCHAINKIT_API_KEY=<Replace-WITH-YOUR-CDP-API-KEY>
NEXT_PUBLIC_URL=
```

### 4. Run locally:

```bash
npm run dev
```

## Customization

### Update Manifest Configuration

The `minikit.config.ts` file configures your manifest located at `app/.well-known/farcaster.json`.

**Skip the `accountAssociation` object for now.**

To personalize your app, change the `name`, `subtitle`, and `description` fields and add images to your `/public` folder. Then update their URLs in the file.

## Deployment

### 1. Deploy to Vercel

```bash
vercel --prod
```

You should have a URL deployed to a domain similar to: `https://your-vercel-project-name.vercel.app/`

### 2. Update environment variables

Add your production URL to your local `.env` file:

```bash
NEXT_PUBLIC_PROJECT_NAME="Your App Name"
NEXT_PUBLIC_ONCHAINKIT_API_KEY=<Replace-WITH-YOUR-CDP-API-KEY>
NEXT_PUBLIC_URL=https://your-vercel-project-name.vercel.app/
```

### 3. Upload environment variables to Vercel

Add environment variables to your production environment:

```bash
vercel env add NEXT_PUBLIC_PROJECT_NAME production
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY production
vercel env add NEXT_PUBLIC_URL production
```

## Account Association

### 1. Sign Your Manifest

1. Navigate to [Farcaster Manifest tool](https://farcaster.xyz/~/developers/mini-apps/manifest)
2. Paste your domain in the form field (ex: your-vercel-project-name.vercel.app)
3. Click the `Generate account association` button and follow the on-screen instructions for signing with your Farcaster wallet
4. Copy the `accountAssociation` object

### 2. Update Configuration

Update your `minikit.config.ts` file to include the `accountAssociation` object:

```ts
export const minikitConfig = {
    accountAssociation: {
        "header": "your-header-here",
        "payload": "your-payload-here",
        "signature": "your-signature-here"
    },
    frame: {
        // ... rest of your frame configuration
    },
}
```

### 3. Deploy Updates

```bash
vercel --prod
```

## Testing and Publishing

### 1. Preview Your App

Go to [base.dev/preview](https://base.dev/preview) to validate your app:

1. Add your app URL to view the embeds and click the launch button to verify the app launches as expected
2. Use the "Account association" tab to verify the association credentials were created correctly
3. Use the "Metadata" tab to see the metadata added from the manifest and identify any missing fields

### 2. Publish to Base App

To publish your app, create a post in the Base app with your app's URL.

## Learn More

For detailed step-by-step instructions, see the [Create a Mini App tutorial](https://docs.base.org/docs/mini-apps/quickstart/create-new-miniapp/) in the Base documentation.



## Features

### Game Configuration

1. **SimpleConfig** (`/api/config` and `/api/game-config`)
   - Basic game settings (color, speed, score)
   - Used by admin panel

2. **GameConfig** (`lib/config.ts`)
   - Advanced settings (grid, obstacles, power-ups)
   - Extensible for future features

### Redis vs In-Memory

- **Redis**: Recommended for production, persistent settings
- **In-Memory**: Suitable for development, resets on restart

## 📝 API Endpoints

### Public Endpoints

- `GET /api/config` - Get game configuration
- `GET /api/game-config` - Get game configuration (alias)
- `GET /api/redis/health` - Redis connection status
- `GET /api/redis/env` - Environment variable check

### Protected Endpoints (Admin Only)

- `POST /api/login` - Admin login
- `GET /api/logout` - Admin logout
- `POST /api/config` - Save settings
- `PUT /api/config` - Update settings
- `PUT /api/game-config` - Update settings

## 🧪 Testing

### Unit Tests (Jest + React Testing Library)

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### E2E Tests (Playwright)

```bash
npm run test:e2e        # Run all E2E tests
npm run test:e2e:ui     # Interactive mode
npm run test:e2e:headed # With browser UI
```

### Blockchain Tests (OnchainTestKit)

**First, start Anvil (local Ethereum node):**

```bash
npm run anvil
# or
anvil --port 8545 --chain-id 31337
```

**Then run the tests:**

```bash
npm run test:e2e:contract     # Smart contract tests
npm run test:e2e:transaction  # Transaction flow tests
npm run test:blockchain       # All blockchain tests
```

**Wallet integration tests (optional):**

```bash
npm run test:e2e:wallet       # Requires MetaMask/Coinbase Wallet
```

### Test Coverage

- ✅ **Unit Tests**: Authentication, API endpoints
- ✅ **E2E Tests**: Admin panel, game config
- ✅ **Contract Tests**: GameScore deployment, score saving
- ✅ **Transaction Tests**: ETH transfers, gas estimation
- ✅ **Wallet Tests**: Connection flow, network switching

### OnchainTestKit Features

**Contract Deployment:**

```typescript
const deployment = await contractHelper.deployGameScore();
expect(deployment.address).toBeTruthy();
```

**Score Operations:**

```typescript
await contractHelper.saveScore(contractAddress, playerAddress, 1000);
const score = await contractHelper.getPlayerScore(contractAddress, playerAddress);
```

**Transaction Tracking:**

```typescript
const receipt = await contractHelper.waitForTransaction(txHash, 1);
expect(receipt?.status).toBe(1);
```

**Gas Estimation:**

```typescript
const estimatedGas = await contract.saveScore.estimateGas(address, 100);
```

## 🐛 Troubleshooting

### "Missing UPSTASH_REDIS_REST_URL" Error

If you don't want to use Redis, leave these variables empty. In-memory storage will be used.

### Cannot Login to Admin Panel

1. Is `ADMIN_USERNAME` and `ADMIN_PASSWORD` defined in `.env.local`?
2. Is `SECRET_COOKIE_PASSWORD` at least 32 characters?
3. Clear browser cookies

### Game Not Loading

1. Check `http://localhost:3000`
2. Any errors in browser console?
3. Is `npm run dev` running?

### Blockchain Tests Not Working

1. Is Anvil installed? `anvil --version`
2. Is Anvil running? `npm run anvil`
3. Is port 8545 available?

## 📚 Technologies

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **OnchainKit** - Coinbase blockchain toolkit
- **Farcaster SDK** - Mini app integration
- **Upstash Redis** - Serverless Redis
- **Iron Session** - Secure session management
- **Hardhat** - Smart contract development
- **Wagmi** - Ethereum React hooks
- **Viem** - TypeScript Ethereum library
- **Jest** - Unit testing
- **Playwright** - E2E testing
- **OnchainTestKit** - Blockchain testing framework
- **Foundry/Anvil** - Local Ethereum node
- **Sentry** - Error tracking
- **Husky** - Git hooks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎮 Blockchain Leaderboard System

This app includes a competitive blockchain-based leaderboard system built on Base Sepolia testnet.

### Features

- **Player Registration**: Register with a unique username using your wallet
- **Score Tracking**: All scores are stored on-chain for transparency
- **Global Leaderboard**: View top players ranked by high score
- **Player Profiles**: Detailed stats including high score, total games, average score
- **Real-time Updates**: Leaderboard auto-refreshes every 30 seconds

### Smart Contract

The `SnakeGameLeaderboard` contract (Solidity ^0.8.24) manages:
- Player registration with username validation (3-20 characters)
- Score submission with automatic high score tracking
- Leaderboard queries (top 10/25/50/100 players)
- Individual player rankings and statistics

### Deployment

1. Deploy the contract to Base Sepolia:
```bash
npx hardhat run scripts/deploy-leaderboard.js --network baseSepolia
```

2. Add the contract address to your `.env.local`:
```bash
NEXT_PUBLIC_LEADERBOARD_CONTRACT=0x...your-contract-address
```

3. Verify the contract on Basescan:
```bash
npx hardhat verify --network baseSepolia YOUR_CONTRACT_ADDRESS
```

### Usage Flow

1. **Connect Wallet**: Connect your wallet using OnchainKit
2. **Register**: Choose a unique username (one-time registration)
3. **Play**: Play the Snake game and earn points
4. **Submit Score**: Submit your score to the blockchain (requires gas)
5. **View Leaderboard**: Check your ranking and compare with other players
6. **Profile**: View detailed stats on your profile page

### Gas Optimization

- Reading leaderboard data is free (view functions)
- Only registration and score submission require gas fees
- Leaderboard sorting is done on-chain for data integrity

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This project is inspired by the [Base Waitlist Mini App Quickstart](https://github.com/base/demos) template.

## 📧 Contact

- **Developer**: [felixripper](https://github.com/felixripper)
- **Project**: [github.com/felixripper/snakebase](https://github.com/felixripper/snakebase)

---

## Disclaimer  

This project is a **demo application** created by the **Base / Coinbase Developer Relations team** for **educational and demonstration purposes only**.  

**There is no token, cryptocurrency, or investment product associated with Cubey, Base, or Coinbase.**  

Any social media pages, tokens, or applications claiming to be affiliated with, endorsed by, or officially connected to Cubey, Base, or Coinbase are **unauthorized and fraudulent**.  

We do **not** endorse or support any third-party tokens, apps, or projects using the Cubey name or branding.  

> [!WARNING]
> Do **not** purchase, trade, or interact with any tokens or applications claiming affiliation with Coinbase, Base, or Cubey.  
> Coinbase and Base will never issue a token or ask you to connect your wallet for this demo.  

For official Base developer resources, please visit:  
- [https://base.org](https://base.org)  
- [https://docs.base.org](https://docs.base.org)  

---
