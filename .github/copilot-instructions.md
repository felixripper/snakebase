# Snakebase - AI Kodlama Asistanı Talimatları

## Mimari Genel Bakış

Snakebase, hibrit mimariye sahip bir Next.js 15 TypeScript uygulamasıdır:
- **Oyun Katmanı**: HTML5 Snake oyunu iframe içinde çalışır (`/public/eat-grow.html`)
- **UI Katmanı**: React sekmeleri (oyun, liderlik, başarılar, turnuvalar, görevler)
- **Veri Katmanı**: Redis (prod) + bellek içi (dev) depolama
- **Blockchain Katmanı**: Opsiyonel Base ağı on-chain liderlik tabloları için

## Kritik İş Akışları

### Geliştirme
```bash
npm run dev          # Next.js dev sunucusunu başlat (port 3000)
npm run anvil        # Sözleşme testi için yerel Ethereum düğümünü başlat
```

### Blockchain
```bash
npm run deploy:baseSepolia  # Sözleşmeyi Base Sepolia'ya dağıt
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

### Test
```bash
npm test                    # Birim testleri (Jest)
npm run test:e2e           # E2E testleri (Playwright)
npm run test:blockchain    # Sözleşme + işlem testleri
```

## Projeye Özel Kalıplar

### Veri Yönetimi
- **Redis-öncelikli**: Kalıcı veri için `lib/redis.ts`'den `kvGet`/`kvSet` kullan
- **Bellek önbelleği**: Performans için `lib/cache.ts`'den `memoryCache` (30s-5min TTL)
- **Zod doğrulama**: Tüm yapılandırma `lib/config.ts`'de `GameConfigSchema.parse()` ile
- **Çift liderlik**: On-chain Wagmi hook'ları ile, off-chain `getTopHighScores()` ile

### Kullanıcı Yönetimi
- **Cüzdan-öncelikli**: Kullanıcılar `walletAddress` ile tanımlanır (küçük harf)
- **Kullanıcı adı doğrulama**: 3-20 karakter, tüm kullanıcılar arasında benzersiz
- **Profil güncellemeleri**: `lib/user-store.ts`'den `updateUsername()`/`updateAvatar()` kullan

### Oyun Entegrasyonu
- **Iframe mesajlaşma**: Oyun `postMessage` olayları gönderir (REGISTER_PLAYER, SUBMIT_ONCHAIN_SCORE, NAVIGATE)
- **Cüzdan köprüleme**: Ana uygulama `writeContract` çağrılarını yönetir, durumu iframe'e aktarır
- **Puan doğrulama**: Göndermeden önce `lib/score-validation.ts`'den `validateScore()` kullan

### Blockchain Entegrasyonu
- **Koşullu render**: Wagmi hook'larından önce `BLOCKCHAIN_ENABLED` kontrol et
- **Sözleşme yapılandırma**: `lib/contract.ts`'den `GAME_CONTRACT_ADDRESS` ve `GAME_CONTRACT_ABI` kullan
- **Gaz optimizasyonu**: Liderlik okuma ücretsiz, sadece kayıt/puanlama gaz maliyeti

### UI Kalıpları
- **Türkçe metin**: Tüm kullanıcıya yönelik metinler Türkçe
- **Sekme navigasyonu**: `activeTab` durumu ile koşullu render kullan
- **CSS modülleri**: `*.module.css` ile kapsamlı stil

## Entegrasyon Noktaları

### Harici Bağımlılıklar
- **OnchainKit**: Cüzdan bağlantısı ve Base ağı
- **Wagmi/Viem**: Sözleşme etkileşimleri
- **Upstash Redis**: Veri kalıcılığı
- **Farcaster SDK**: Mini-app framework

### API Uç Noktaları
- **Genel**: `/api/leaderboard/top`, `/api/config`
- **Korumalı**: `/api/login`, `/api/config` (POST/PUT admin için)

## Yaygın Tuzaklar

- **Hook sırası**: Wagmi hook'ları koşulsuz çağrılmalı, `enabled` bayrağı kullan
- **Sözleşme kontrolleri**: Blockchain çağrılarından önce `CONTRACT_ADDRESS !== '0x000000...'` doğrula
- **Environment değişkenleri**: Eksik değişkenler sessiz hatalara neden olur - `.example.env` kontrol et
- **Iframe güvenliği**: Mesaj kaynaklarını doğrula ve cross-origin sorunları yönet

## Anahtar Dosyalar

- `lib/config.ts` - Oyun yapılandırma şeması
- `lib/contract.ts` - Blockchain entegrasyonu
- `lib/user-store.ts` - Kullanıcı yönetimi
- `lib/score-store.ts` - Puan takibi
- `app/page.tsx` - Iframe ile ana oyun sayfası
- `app/_components/Leaderboard.tsx` - On-chain liderlik
- `contracts/SnakeGameScore.sol` - Akıllı sözleşme</content>
<parameter name="filePath">/workspaces/snakebase/.github/copilot-instructions.md