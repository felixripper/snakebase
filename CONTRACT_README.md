# 🎮 SnakeGameScore - Base Mainnet Contract

Basit ve gas-efficient bir Snake oyunu score tracking kontratı. Base Mainnet için optimize edilmiş.

## 📋 Contract Özellikleri

### ✅ Ne Yapabilir?
- ✨ Oyuncu kaydı (username ile)
- 🏆 Score gönderme ve high score takibi
- 📊 Leaderboard (top N oyuncu)
- 👤 Oyuncu bilgilerini sorgulama
- 🔍 On-chain verification

### 💰 Gas Maliyetleri (Base Mainnet)
- Register: ~$0.01 - $0.05
- Submit Score: ~$0.01 - $0.03
- Deploy: ~$1 - $3

## 🚀 Hızlı Başlangıç

### 1. Deploy Etme

```bash
# .env.local dosyasına private key ekle
DEPLOYER_PRIVATE_KEY=your_private_key_without_0x

# Deploy
npm run deploy:base
```

### 2. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_BLOCKCHAIN_ENABLED=true
NEXT_PUBLIC_GAME_CONTRACT=0xYourDeployedAddress
NEXT_PUBLIC_CHAIN_ID=8453
```

### 3. Kullanım (React)

```tsx
import { useGameContract, usePlayerData } from '@/lib/hooks/useGameContract';

function MyComponent() {
  const { address } = useAccount();
  const { register, submitScore, isPending } = useGameContract();
  const { player } = usePlayerData(address);

  return (
    <div>
      {!player?.isRegistered ? (
        <button onClick={() => register('MyUsername')}>
          Register
        </button>
      ) : (
        <>
          <p>High Score: {player.highScore.toString()}</p>
          <button onClick={() => submitScore(1000)}>
            Submit Score
          </button>
        </>
      )}
    </div>
  );
}
```

## 📁 Dosyalar

- **Contract**: `contracts/SnakeGameScore.sol`
- **Deploy Script**: `scripts/deploy-leaderboard.js`
- **React Hooks**: `lib/hooks/useGameContract.ts`
- **Config**: `lib/contract.ts`
- **Deploy Guide**: `DEPLOY_CONTRACT.md`

## 🔧 Contract Functions

### Write (Gas gerektirir)
```solidity
function register(string calldata _username) external
function submitScore(uint256 _score) external
```

### Read (Ücretsiz)
```solidity
function getPlayer(address _player) external view returns (...)
function isRegistered(address _player) external view returns (bool)
function getTotalPlayers() external view returns (uint256)
function getTopPlayers(uint256 _limit) external view returns (...)
```

## 🎯 OnchainKit Özellikleri

Contract OnchainKit ile tam uyumlu:
- ✅ Wagmi hooks kullanımı
- ✅ Transaction tracking
- ✅ Event emission
- ✅ Base Mainnet optimization
- ✅ Wallet integration

## 🔐 Güvenlik

- ✅ Simple ve audited design
- ✅ No admin functions (tamamen decentralized)
- ✅ No upgradeable logic
- ✅ Minimal attack surface
- ✅ Gas optimized

## 📊 Vercel Deployment

Vercel'de environment variables ekleyin:
1. Dashboard → Settings → Environment Variables
2. Şu değişkenleri ekleyin:
   - `NEXT_PUBLIC_BLOCKCHAIN_ENABLED=true`
   - `NEXT_PUBLIC_GAME_CONTRACT=0xAddress`
   - `NEXT_PUBLIC_CHAIN_ID=8453`
3. Redeploy

## 🛠️ Development

```bash
# Install
npm install

# Compile contract
npx hardhat compile

# Test (local)
npx hardhat test

# Deploy to Base Mainnet
npm run deploy:base

# Verify on BaseScan
npx hardhat verify --network base 0xYourAddress
```

## 📱 Frontend Integration

Contract şu sayfalarla entegre edilebilir:
- **Score Submission**: Oyun bittiğinde otomatik score gönder
- **Leaderboard**: On-chain leaderboard göster
- **Profile**: Oyuncu stats ve history
- **Achievements**: On-chain achievement tracking

## 🌐 Links

- **BaseScan**: https://basescan.org
- **Base Bridge**: https://bridge.base.org
- **OnchainKit**: https://onchainkit.xyz
- **Base Docs**: https://docs.base.org

## ❓ Sorun Giderme

Detaylı troubleshooting için: `DEPLOY_CONTRACT.md`

---

**Ready to deploy?** 🚀

```bash
npm run deploy:base
```
