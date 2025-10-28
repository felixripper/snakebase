# 🐍 Snakebase

A blockchain-powered Snake game built on Base with Farcaster Mini App integration.

## Features

- **Classic Snake Game**: Play the classic snake game directly in your browser
- **Blockchain Leaderboard**: Global leaderboard stored on Base blockchain
- **Player Profiles**: View detailed player statistics and game history
- **Wallet Integration**: Connect with Web3 wallets for on-chain features
- **Farcaster Integration**: Play as a Farcaster Mini App

## Prerequisites

- Node.js 18-20
- A [Farcaster](https://farcaster.xyz/) account (for Mini App features)
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) API Key
- Web3 wallet (MetaMask, Coinbase Wallet, etc.) for blockchain features

## Getting Started

### 1. Clone this repository

```bash
git clone https://github.com/felixripper/snakebase.git
cd snakebase
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure environment variables

Create a `.env` file with the following variables:

```bash
# Required for session management (32+ characters)
SECRET_COOKIE_PASSWORD=your-secret-key-at-least-32-characters-long

# App URL
NEXT_PUBLIC_URL=http://localhost:3000

# Blockchain features
NEXT_PUBLIC_BLOCKCHAIN_ENABLED=true
NEXT_PUBLIC_GAME_CONTRACT=0x... # Your deployed contract address

# OnchainKit API key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-api-key

# Optional: Redis for persistent storage
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Farcaster Manifest Configuration

The `minikit.config.ts` file configures your Farcaster manifest. Update the following fields:

- `name`: Your app name
- `subtitle`: Short description
- `description`: Detailed description
- `iconUrl`: App icon URL
- `heroImageUrl`: Hero image URL

The manifest is automatically generated during build and served at `/.well-known/farcaster.json`.

## Deployment

### Deploy Smart Contract

Deploy the leaderboard contract to Base:

```bash
# Deploy to Base Sepolia (testnet)
npm run deploy:baseSepolia

# Deploy to Base (mainnet)
npm run deploy:base
```

Update your `.env` with the deployed contract address.

### Deploy to Vercel

```bash
vercel --prod
```

Add environment variables to Vercel:

```bash
vercel env add SECRET_COOKIE_PASSWORD production
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY production
vercel env add NEXT_PUBLIC_URL production
vercel env add NEXT_PUBLIC_BLOCKCHAIN_ENABLED production
vercel env add NEXT_PUBLIC_GAME_CONTRACT production
```

### Account Association for Farcaster

1. Navigate to [Farcaster Manifest tool](https://farcaster.xyz/~/developers/mini-apps/manifest)
2. Paste your domain (e.g., `your-app.vercel.app`)
3. Generate account association and copy the object
4. Update `minikit.config.ts` with the `accountAssociation` object
5. Deploy the updated manifest

## Project Structure

```
snakebase/
├── app/
│   ├── page.tsx              # Main game page
│   ├── leaderboard/          # Blockchain leaderboard
│   ├── profile/              # Player profile page
│   ├── share/                # Share frame for Farcaster
│   ├── api/                  # API routes
│   │   ├── auth/             # Wallet authentication
│   │   ├── leaderboard/      # Leaderboard endpoints
│   │   └── scores/           # Score management
│   └── _components/          # React components
├── contracts/                # Smart contracts
├── lib/                      # Utility functions
├── public/
│   └── eat-grow.html         # Snake game HTML
├── scripts/                  # Deployment scripts
└── minikit.config.ts         # Farcaster manifest config
```

## Smart Contract

The `SnakeGameLeaderboard` contract manages:
- Player registration with unique usernames
- Score submission with automatic high score tracking
- Leaderboard queries (top players)
- Individual player statistics

## Technologies

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **OnchainKit** - Coinbase blockchain toolkit
- **Farcaster SDK** - Mini app integration
- **Wagmi** - Ethereum React hooks
- **Viem** - TypeScript Ethereum library
- **Hardhat** - Smart contract development
- **Upstash Redis** - Optional persistent storage

## Testing

```bash
# Build
npm run build

# Lint
npm run lint

# E2E tests
npm run test:e2e

# Blockchain tests (requires Anvil)
npm run anvil  # In separate terminal
npm run test:blockchain
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

Built with inspiration from the [Base Waitlist Mini App Quickstart](https://github.com/base/demos) template.

## Contact

- **Developer**: [felixripper](https://github.com/felixripper)
- **Project**: [github.com/felixripper/snakebase](https://github.com/felixripper/snakebase)

---

**Disclaimer**: This is a demo application for educational purposes. There are no official tokens or investment products associated with this project.
