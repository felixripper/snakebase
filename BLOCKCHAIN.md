# Blockchain Integration Guide

## Smart Contract Deployment

### 1. Prerequisites
- Private key with some Base ETH (for gas fees)
- RPC URL for Base network

### 2. Configure Environment Variables

Add to `.env.local`:
```bash
# For deployment
DEPLOYER_PRIVATE_KEY=your_private_key_here
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# After deployment - for frontend
NEXT_PUBLIC_BLOCKCHAIN_ENABLED=true
NEXT_PUBLIC_LEADERBOARD_CONTRACT_BASE=0x... # deployed address
```

### 3. Deploy Contract

**Deploy to Base Sepolia (Testnet):**
```bash
npm run deploy:baseSepolia
```

**Deploy to Base Mainnet:**
```bash
npm run deploy:base
```

### 4. Update Vercel Environment Variables

After deployment, add to Vercel:
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_BLOCKCHAIN_ENABLED` = `true`
   - `NEXT_PUBLIC_LEADERBOARD_CONTRACT_BASE` = `0x...` (your deployed address)
   - `NEXT_PUBLIC_LEADERBOARD_CONTRACT_SEPOLIA` = `0x...` (if using testnet)

### 5. Redeploy Frontend

```bash
git commit -am "Enable blockchain integration"
git push
```

## Contract Functions

### Write Functions (Require Wallet Signature)
- `registerPlayer(username)` - Register player on-chain
- `submitScore(score)` - Submit score to blockchain
- `updateUsername(newUsername)` - Update username

### Read Functions (Free)
- `getPlayer(address)` - Get player data
- `getPlayerRank(address)` - Get player's rank
- `getTopPlayers(limit)` - Get top N players
- `getTotalPlayers()` - Get total player count
- `isPlayerRegistered(address)` - Check if registered
- `isUsernameAvailable(username)` - Check username availability

## React Hooks

```tsx
import { useLeaderboardContract, usePlayerData, useTopPlayers } from '@/lib/hooks/useLeaderboardContract';

function MyComponent() {
  const { address } = useAccount();
  const { registerPlayer, submitScore, isPending } = useLeaderboardContract();
  const { player, isLoading } = usePlayerData(address);
  const { topPlayers } = useTopPlayers(10);

  // Register player
  const handleRegister = async () => {
    await registerPlayer('MyUsername');
  };

  // Submit score
  const handleSubmit = async () => {
    await submitScore(1000);
  };

  return (
    <div>
      {player && <p>High Score: {player.highScore.toString()}</p>}
      {topPlayers.map((entry, i) => (
        <div key={i}>{entry.username}: {entry.score.toString()}</div>
      ))}
    </div>
  );
}
```

## Hybrid Mode (Database + Blockchain)

By default, the app uses a database for scores. When blockchain is enabled:
- **Database**: Fast, free, suitable for all users
- **Blockchain**: Optional, on-chain verification, eternal storage

You can use both:
1. Store all scores in database (fast)
2. Allow users to optionally "verify" their high score on-chain
3. Display blockchain-verified scores with a special badge

## Gas Costs

Approximate costs on Base (as of 2025):
- Register Player: ~$0.01 - $0.05
- Submit Score: ~$0.01 - $0.03
- Update Username: ~$0.01 - $0.03

Base is an L2 with very low fees compared to Ethereum mainnet.

## Testing

Run contract tests:
```bash
npx hardhat test
```

Run E2E tests with local blockchain:
```bash
npm run anvil  # Terminal 1
npm run test:e2e:contract  # Terminal 2
```

## Troubleshooting

**Contract not available:**
- Check `NEXT_PUBLIC_BLOCKCHAIN_ENABLED=true`
- Verify contract address is set
- Make sure you're on the correct network (Base)

**Transactions failing:**
- Check wallet has enough ETH for gas
- Verify contract is deployed on current network
- Check contract address is correct

**Username already taken:**
- Usernames are global on-chain
- Use `isUsernameAvailable()` before registering
