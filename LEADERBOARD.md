# Blockchain Leaderboard Implementation

## Overview
This document describes the competitive blockchain-based leaderboard system added to SnakeBase.

## Architecture

### Smart Contract
- **File**: `contracts/GameScore.sol`
- **Contract**: `SnakeGameLeaderboard`
- **Blockchain**: Base Sepolia Testnet
- **Solidity Version**: ^0.8.24

#### Key Features
1. **Player Registration**: One-time username registration per wallet address
2. **Score Tracking**: Automatic high score and total score tracking
3. **Leaderboard Queries**: Sorted rankings with configurable limits
4. **Player Stats**: Total games, total score, timestamps

#### Main Functions
- `registerPlayer(string username)`: Register with unique username (3-20 chars)
- `submitScore(uint256 score)`: Submit game score (updates high score if beaten)
- `updateUsername(string newUsername)`: Change username
- `getTopPlayers(uint256 limit)`: Get sorted leaderboard (top N players)
- `getPlayerRank(address player)`: Get individual player's rank
- `getPlayer(address player)`: Get complete player data
- `getTotalPlayers()`: Get total registered player count
- `isUsernameAvailable(string username)`: Check username availability
- `isPlayerRegistered(address player)`: Check registration status

#### Data Structures
```solidity
struct Player {
    address playerAddress;
    string username;
    uint256 highScore;
    uint256 totalGames;
    uint256 totalScore;
    uint256 registeredAt;
    uint256 lastPlayedAt;
    bool isRegistered;
}

struct LeaderboardEntry {
    uint256 rank;
    address playerAddress;
    string username;
    uint256 highScore;
    uint256 totalGames;
}
```

#### Events
- `PlayerRegistered(address player, string username, uint256 timestamp)`
- `ScoreSubmitted(address player, uint256 score, uint256 newHighScore, uint256 timestamp)`
- `UsernameUpdated(address player, string oldUsername, string newUsername, uint256 timestamp)`

## Frontend Components

### 1. Leaderboard Component
- **File**: `app/_components/Leaderboard.tsx`
- **Purpose**: Display global rankings and user stats
- **Features**:
  - Top N players display (10/25/50/100 selectable)
  - Real-time user stats card
  - Auto-refresh every 30 seconds
  - Medal emojis for top 3 (🥇🥈🥉)
  - Highlighted current user row
  - Responsive design

### 2. Player Registration Component
- **File**: `app/_components/PlayerRegistration.tsx`
- **Purpose**: New player onboarding
- **Features**:
  - Username input with validation (3-20 characters)
  - Real-time username availability check
  - Transaction status tracking
  - Error handling
  - Success confirmation

### 3. Score Submission Component
- **File**: `app/_components/ScoreSubmission.tsx`
- **Purpose**: Submit game scores to blockchain
- **Features**:
  - Score display
  - Wallet connection check
  - Gas fee notification
  - Transaction confirmation
  - Success animation

### 4. Player Profile Page
- **File**: `app/profile/page.tsx`
- **Purpose**: Detailed player statistics
- **Features**:
  - High score, total games, total score
  - Average score calculation
  - Global rank display
  - Registration date
  - Last played timestamp
  - View other players' profiles via address query param

### 5. Leaderboard Page
- **File**: `app/leaderboard/page.tsx`
- **Purpose**: Dedicated leaderboard view
- **Features**:
  - Full-page leaderboard display
  - Navigation to game and profile

## API Endpoints

### `/api/check-username`
- **Method**: GET
- **Purpose**: Validate username format
- **Query Params**: `username` (string)
- **Response**:
  ```json
  {
    "available": true|false,
    "error": "error message" // if validation fails
  }
  ```
- **Validation**:
  - Length: 3-20 characters
  - Characters: Letters, numbers, underscores only

## Deployment

### Prerequisites
1. Base Sepolia testnet RPC URL
2. Deployer wallet private key with ETH on Base Sepolia
3. Hardhat configuration for Base Sepolia network

### Steps

1. **Deploy Contract**:
   ```bash
   npx hardhat run scripts/deploy-leaderboard.js --network baseSepolia
   ```

2. **Update Environment Variables**:
   Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_LEADERBOARD_CONTRACT=0x...deployed-address
   ```

3. **Verify Contract** (optional):
   ```bash
   npx hardhat verify --network baseSepolia YOUR_CONTRACT_ADDRESS
   ```

4. **Deploy Frontend**:
   ```bash
   vercel --prod
   ```

5. **Update Vercel Environment**:
   ```bash
   vercel env add NEXT_PUBLIC_LEADERBOARD_CONTRACT production
   ```

## User Flow

1. **First-Time User**:
   - Connect wallet
   - Register with unique username
   - Transaction confirmation (costs gas)
   - Registration success

2. **Gameplay**:
   - Play Snake game
   - Achieve score
   - Option to submit score to blockchain (costs gas)

3. **Score Submission**:
   - View score
   - Confirm transaction in wallet
   - Wait for blockchain confirmation
   - See updated leaderboard

4. **Leaderboard Viewing**:
   - View top players (free, no gas)
   - See own rank and stats
   - View other players' profiles
   - Auto-refresh for latest data

## Gas Optimization

### Free Operations (View Functions)
- Reading leaderboard (`getTopPlayers`)
- Checking player rank (`getPlayerRank`)
- Viewing player data (`getPlayer`)
- Total player count (`getTotalPlayers`)
- Username availability (`isUsernameAvailable`)

### Paid Operations (Transactions)
- Player registration (`registerPlayer`)
- Score submission (`submitScore`)
- Username update (`updateUsername`)

### Optimization Techniques
- Sorting done on-chain for data integrity
- Limited leaderboard size options to reduce gas
- Batch reads using multicall pattern (via wagmi)
- View functions for all read operations

## Security Considerations

1. **Username Validation**:
   - On-chain enforcement of uniqueness
   - Length and character restrictions
   - Case-insensitive comparison

2. **Score Integrity**:
   - Only wallet owner can submit scores
   - High score only updated if beaten
   - Timestamp tracking for audit trail

3. **Access Control**:
   - Players can only update their own data
   - No admin override functions
   - Transparent on-chain verification

## Testing

### Contract Testing
```bash
npx hardhat test
```

### Frontend Testing
```bash
npm run build
npm run start
```

### E2E Testing with Playwright
```bash
npm run test:e2e
```

## Future Enhancements

1. **Seasons/Tournaments**: Time-limited competitions
2. **Rewards**: Token rewards for top players
3. **Social Features**: Friend lists, challenges
4. **Achievements**: On-chain badge system
5. **Multiplayer**: Real-time competitive modes
6. **NFT Integration**: Unique rewards for milestones
7. **Leaderboard History**: Historical rankings and trends
8. **Player Search**: Find players by username or address

## Configuration

### Environment Variables
```bash
# Required
NEXT_PUBLIC_LEADERBOARD_CONTRACT=0x...

# Optional (for better performance)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=...
```

### Contract Address
Update in multiple locations:
- `.env.local` (development)
- `.env` (production, via Vercel)
- Hardcoded fallback in components (for type safety)

## Troubleshooting

### Contract Not Found
- Verify `NEXT_PUBLIC_LEADERBOARD_CONTRACT` is set
- Check contract is deployed on Base Sepolia
- Confirm wallet is connected to Base Sepolia network

### Transaction Failures
- Ensure sufficient ETH for gas fees
- Check wallet is connected
- Verify username doesn't already exist
- Confirm network is Base Sepolia

### Leaderboard Not Loading
- Check contract address is correct
- Verify RPC endpoint is responding
- Ensure OnchainKit API key is valid (if using)

## Resources

- [Base Sepolia Testnet](https://sepolia.basescan.org/)
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-sepolia-faucet)
- [OnchainKit Documentation](https://onchainkit.xyz/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Hardhat Documentation](https://hardhat.org/)

## Support

For issues or questions:
1. Check this documentation
2. Review contract source code
3. Test on Base Sepolia testnet first
4. Contact developer via GitHub issues
