# Snakebase - AI Kodlama Asistanı Talimatları

## Mimari Genel Bakış

Snakebase, hibrit mimariye sahip bir Next.js 15 TypeScript uygulamasıdır:
- **Oyun Katmanı**: HTML5 Snake oyunu iframe içinde çalışır (`/public/eat-grow.html`)
- **UI Katmanı**: React sekmeleri (oyun, liderlik, başarılar, turnuvalar, görevler)
- **Veri Katmanı**: Redis (prod) + bellek içi (dev) depolama
- **Blockchain Katmanı**: **Base Mainnet** ağı on-chain liderlik tabloları için

## Kritik İş Akışları

### Geliştirme
```bash
npm run dev          # Next.js dev sunucusunu başlat (port 3000)
npm run anvil        # Sözleşme testi için yerel Ethereum düğümünü başlat
```

### Blockchain
```bash
npm run deploy:base  # Sözleşmeyi Base Mainnet'e dağıt
npx hardhat verify --network base <CONTRACT_ADDRESS>
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
# Snakebase — AI Kodlama Asistanı (kısa ve uygulanabilir)

Amaç: Bu dosya bir AI kodlama ajanının (Copilot / otomatik PR ajanı) projede hızlıca üretken olması için gerekli, kod-odaklı kuralları, ana akışları ve kritik dosya referanslarını sağlar.

1) Hızlı mimari (1 satır): Next.js 15 + TypeScript uygulaması; oyun HTML5 iframe (public/eat-grow.html), React UI, Redis (prod) ve OnchainKit ile Base on-chain liderlik.

2) Hızlı komutlar (yerel/CI):
- npm run dev         # Next.js geliştirme (port 3000)
- npm run anvil       # Lokal Ethereum (sözleşme testleri için)
- npm test            # Jest birim testleri
- npm run test:e2e    # Playwright E2E
- npm run test:blockchain # Sözleşme + işlem testleri
- npm run deploy:baseSepolia && npx hardhat verify --network baseSepolia <ADDR>

3) Kritik dosyalar (kısa amaç):
- `public/eat-grow.html` — oyun iframe; postMessage formatı buradan gelir
- `app/page.tsx` — iframe entegrasyonu ve mesaj yönlendirme
- `lib/score-validation.ts` — gönderilecek puanların doğrulanması (kullan)
- `lib/redis.ts` — kalıcı veri için `kvGet`/`kvSet`
- `lib/cache.ts` — in-memory cache (TTL 30s–5min)
- `lib/config.ts` — Zod şeması ve oyun konfigürasyonu
- `app/rootProvider.tsx` — OnchainKit provider kurulumu
- `app/_contexts/UserContext.tsx` — OnchainKit ile cüzdan entegrasyonu
- `contracts/SnakeGameScore.sol` — akıllı sözleşme referansı

4) Projeye özgü kurallar ve örnekler (mutlaka takip et):
- Kullanıcılar cüzdan temelli: `walletAddress` küçük harf ile saklanır.
- Kullanıcı adı: 3–20 karakter, benzersiz (kullanıcı doğrulaması `api/check-username`).
- Puan gönderimi: iframe `postMessage` olayları -> en az: REGISTER_PLAYER, SUBMIT_ONCHAIN_SCORE, NAVIGATE.
- Puan doğrulama: Her zaman `lib/score-validation.ts` içindeki `validateScore()` kullanılarak onaylanmalı.
- Redis-öncelikli: kalıcı veri `lib/redis.ts` üzerinden; kısa süreli cache `lib/cache.ts`.

5) Blockchain & OnchainKit nüansları:
- OnchainKitProvider ile Base ağı konfigürasyonu
- `BLOCKCHAIN_ENABLED` kontrolü olmadan OnchainKit hook'larını koşma
- Wagmi hook'larında `enabled` bayrağı kullan (OnchainKit üzerinden)

6) Güvenlik / tuzaklar (agent için kısa uyarılar):
- Iframe mesajlarını işlerken `event.origin`/kaynak doğrulaması yapın.
- Eksik environment değişkenleri sessiz hatalara sebep olur — `.example.env`'yi kontrol et.
- Hook çağrı sırası önemlidir; Wagmi/React hooklarını kurallara uygun kullan.

7) Değişiklik sözleşmesi (AI ajanı için):
- Giriş/çıkış kontratı: küçük, izole değişiklikler (helper, test, doc) uygundur; UI metinleri Türkçe bırakın.
- Kritik alanlar: `lib/*`, `app/page.tsx`, `public/eat-grow.html`, `contracts/*` — büyük değişikliklerden önce PR ile tartışın.

8) Test & doğrulama: her PR için ilgili birim test(ler) ve mümkünse E2E testi ekleyin; yerel testleri çalıştırıp yeşil olmadan PR açmayın.

9) Nereden başlamalıyım? (agent adımları)
- 1) `app/page.tsx` ve `public/eat-grow.html`'i inceleyin (iframe mesajlaşma).
- 2) `lib/score-validation.ts` ve `lib/contract.ts` ile puan akışını takip edin.
- 3) Değişiklik yapmadan önce `npm test` çalıştırın.

Geri bildirim ister misiniz? Belirli bir görev türü (ör. otomatik PR, test ekleme, sözleşme güncelleme) için ek kurallar ekleyebilirim.