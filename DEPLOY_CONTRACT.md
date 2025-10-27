# 🚀 Base Mainnet'e Contract Deploy Etme Rehberi

## Gereksinimler

1. **Base ETH**: Wallet'ınızda en az ~0.001 ETH olmalı (gas için)
2. **Private Key**: Metamask veya başka bir wallet'tan
3. **RPC URL**: Base Mainnet RPC (varsayılan: https://mainnet.base.org)

## Adım 1: Private Key Hazırlama

### MetaMask'tan Private Key Alma:
1. MetaMask'ı açın
2. Sağ üst menüden "Account Details" → "Show Private Key"
3. Şifrenizi girin ve private key'i kopyalayın
4. **DİKKAT**: Bu key'i asla kimseyle paylaşmayın!

### .env.local Dosyasına Ekleme:
```bash
# .env.local dosyasını düzenleyin
DEPLOYER_PRIVATE_KEY=buraya_private_key_yapistirin_0x_olmadan

# Örnek (KULLANMAYIN - bu sahte bir key):
# DEPLOYER_PRIVATE_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

## Adım 2: Base ETH Temin Etme

Wallet'ınızda Base ETH yoksa:

### Seçenek A: Bridge ile (Önerilen)
1. https://bridge.base.org adresine gidin
2. Ethereum Mainnet'ten Base'e ETH bridge edin
3. Minimum: ~$5 değerinde ETH (deploy için ~$1-2 yeterli)

### Seçenek B: Exchange'den Çekme
1. Coinbase, Binance, veya OKX gibi exchange'lerde
2. "Base Network" seçerek direkt çekin

### Seçenek C: Base Faucet (Testnet için)
Test etmek isterseniz önce Sepolia:
- https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

## Adım 3: Contract Deploy Etme

```bash
# Dependencies'leri yükle (eğer yüklemediysen)
npm install

# Contract'ı derle
npx hardhat compile

# Base Mainnet'e deploy et
npm run deploy:base
```

### Başarılı Deploy Çıktısı:
```
🚀 Deploying SnakeGameScore contract to Base...

📝 Deploying with account: 0xYourAddress
💰 Account balance: 0.005 ETH

⏳ Deploying contract...

✅ SnakeGameScore deployed successfully!
📍 Contract address: 0x1234567890123456789012345678901234567890

============================================================
🔧 NEXT STEPS:
============================================================

1️⃣  Add to your .env.local:
   NEXT_PUBLIC_BLOCKCHAIN_ENABLED=true
   NEXT_PUBLIC_GAME_CONTRACT=0x1234567890123456789012345678901234567890
   NEXT_PUBLIC_CHAIN_ID=8453
```

## Adım 4: Environment Variables Ayarlama

### Local Development (.env.local):
```bash
NEXT_PUBLIC_BLOCKCHAIN_ENABLED=true
NEXT_PUBLIC_GAME_CONTRACT=0xYourContractAddress
NEXT_PUBLIC_CHAIN_ID=8453
```

### Vercel Production:
1. Vercel Dashboard'a gidin
2. Project → Settings → Environment Variables
3. Şu değişkenleri ekleyin:
   - `NEXT_PUBLIC_BLOCKCHAIN_ENABLED` = `true`
   - `NEXT_PUBLIC_GAME_CONTRACT` = `0xYourContractAddress`
   - `NEXT_PUBLIC_CHAIN_ID` = `8453`
4. Environment: **Production** (ve isterseniz Preview, Development)
5. Kaydet ve redeploy

## Adım 5: Contract Verify Etme (Opsiyonel)

BaseScan'de contract source code'unu verify edebilirsiniz:

```bash
# BaseScan API key alın (ücretsiz): https://basescan.org/myapikey
# .env.local'e ekleyin:
BASESCAN_API_KEY=your_api_key

# Verify komutu:
npx hardhat verify --network base 0xYourContractAddress
```

## Adım 6: Test Etme

1. Local'de test edin:
```bash
npm run dev
```

2. http://localhost:3000 adresine gidin
3. Wallet'ı bağlayın (Base Mainnet'te olduğunuzdan emin olun)
4. Oyunu oynayın ve score gönderin
5. BaseScan'de transaction'ı görün: https://basescan.org/address/0xYourContractAddress

## Gas Ücretleri (Tahmini)

Base Mainnet'te ortalama maliyetler:
- **Register**: ~$0.01 - $0.05
- **Submit Score**: ~$0.01 - $0.03
- **Total Deploy**: ~$1 - $3

*Not: Base bir L2 olduğu için çok ucuz!*

## Sorun Giderme

### "Insufficient funds" hatası:
- Wallet'ınızda Base ETH olduğundan emin olun
- `npx hardhat run scripts/check-balance.js --network base`

### "Nonce too high" hatası:
- MetaMask → Settings → Advanced → Clear Activity Tab Data

### Contract deploy oldu ama çalışmıyor:
- Environment variable'ları kontrol edin
- Doğru network'te (Base Mainnet) olduğunuzdan emin olun
- Browser console'da hata var mı kontrol edin

### Transaction pending kalıyor:
- Base bazen yoğun olabilir, 1-2 dakika bekleyin
- https://basescan.org/tx/0xYourTxHash adresinden takip edin

## Faydalı Linkler

- **Base Bridge**: https://bridge.base.org
- **BaseScan**: https://basescan.org
- **Base Docs**: https://docs.base.org
- **OnchainKit**: https://onchainkit.xyz
- **Gas Tracker**: https://basescan.org/gastracker

## Güvenlik Notları

⚠️ **ÖNEMLİ**:
- Private key'inizi asla GitHub'a commit etmeyin
- `.env.local` zaten `.gitignore`'da
- Production'da ayrı bir deployment wallet kullanın
- Contract deploy ettikten sonra private key'i güvenli bir yere saklayın

## Contract Özellikleri

### Write Functions (Gas Gerektirir):
- `register(username)` - Oyuncu kaydı
- `submitScore(score)` - Skor gönderme

### Read Functions (Ücretsiz):
- `getPlayer(address)` - Oyuncu bilgisi
- `isRegistered(address)` - Kayıt kontrolü
- `getTotalPlayers()` - Toplam oyuncu sayısı
- `getTopPlayers(limit)` - En iyi oyuncular

## Sonraki Adımlar

Contract deploy ettikten sonra:
1. ✅ Vercel environment variables'ı güncelleyin
2. ✅ Redeploy yapın
3. ✅ Production'da test edin
4. 🎮 Oyunu paylaşın ve kullanıcıları davet edin!

---

**Yardıma mı ihtiyacınız var?**
- Contract kodu: `/workspaces/snakebase/contracts/SnakeGameScore.sol`
- Deploy script: `/workspaces/snakebase/scripts/deploy-leaderboard.js`
- React hooks: `/workspaces/snakebase/lib/hooks/useGameContract.ts`
