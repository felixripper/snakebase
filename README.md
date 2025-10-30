# Snakebase

Bu proje, **Base Mainnet** ağında çalışan bir Snake oyunu uygulamasıdır. OnchainKit kullanarak cüzdan entegrasyonu ve blockchain etkileşimleri sağlar.

> [!IMPORTANT]
> Bu uygulama [Base OnchainKit](https://www.base.org/build/onchainkit) rehberini temel alır. OnchainKit entegrasyonu için resmi dokümantasyonu inceleyin.

## Özellikler

- HTML5 Snake oyunu (iframe içinde)
- Cüzdan bağlantısı ve Base ağı entegrasyonu
- Redis tabanlı veri depolama
- Liderlik tabloları (on-chain ve off-chain)
- Farcaster Mini App desteği
- **Admin Paneli**: Kapsamlı oyun ve arayüz ayarları

## Admin Paneli

Admin paneli (`/admin`) üzerinden oyun ayarlarını yönetebilirsiniz:

- **Oyun Ayarları**: Hız, zorluk, boyutlar, oyun kuralları
- **Arayüz Tasarımı**: Renkler, fontlar, boyutlar, tema ayarları
- **Yem & Tuzaklar**: Yem görünümleri, animasyonlar, tuzak ayarları
- **Hazır Ayarlar**: Kolay, normal, zor seviye preset'leri

> [!NOTE]
> Admin paneli şu anda geliştirme ortamında `/admin` adresinden erişilebilir.

## 🚀 Hızlı Başlangıç

### Ana Sayfa
- **Landing Page**: `http://localhost:3000` - Oyun tanıtımı ve giriş
- **Oyun Sayfası**: `http://localhost:3000/game` - Ana oyun arayüzü
- **Admin Paneli**: `http://localhost:3000/admin` - Ayarlar yönetimi

### Kurulum

1. Depoyu klonlayın:

```bash
git clone https://github.com/felixripper/snakebase.git
cd snakebase
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

4. Tarayıcıda açın: http://localhost:3000

### Smart Contract Deployment

Base Mainnet'e deploy etmek için:

1. **Environment Variables** ayarlayın:

```bash
# .env dosyasına ekleyin
PRIVATE_KEY=your_private_key_without_0x_prefix
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

2. **Contract'ı compile edin**:

```bash
npm run compile
```

3. **Test çalıştırın**:

```bash
npx hardhat test
```

4. **Base Mainnet'e deploy edin**:

```bash
npm run deploy:base
```

5. **Contract'ı verify edin**:

```bash
npx hardhat verify --network base <DEPLOYED_CONTRACT_ADDRESS>
```

6. **Environment'ı güncelleyin**:

```env
NEXT_PUBLIC_GAME_CONTRACT_ADDRESS=0x_your_deployed_contract_address
```

## 📱 Kullanıcı Akışı

1. **Giriş Sayfası**: Oyun tanıtımı, özellikler, istatistikler
2. **Wallet Bağlantısı**: OnchainKit ile Base ağı bağlantısı
3. **Oyun**: HTML5 Snake oyunu iframe içinde
4. **Skor Kaydı**: Otomatik onchain skor kaydetme
5. **Liderlik**: Sıralama tablosu görüntüleme

### Sayfa Yapısı

- `/` - Landing page (giriş sayfası)
- `/game` - Ana oyun sayfası
- `/admin` - Admin paneli (geliştirme için)
- `/api/*` - API uç noktaları

### Geliştirme Notları

- **Iframe Entegrasyonu**: Oyun `public/eat-grow.html` içinde çalışır
- **Mesajlaşma**: Oyun ve ana uygulama arasında `postMessage` API'si kullanılır
- **Konfigürasyon**: Oyun ayarları `lib/config.ts` ve `game-config.json` üzerinden yönetilir
- **Doğrulama**: Puanlar `lib/score-validation.ts` ile doğrulanır
- **Veri Depolama**: Redis (`lib/redis.ts`) ve bellek içi cache (`lib/cache.ts`) kullanılır

## Komutlar

- `npm run dev` - Geliştirme sunucusu
- `npm run build` - Üretim yapısı
- `npm test` - Birim testleri
- `npm run test:e2e` - E2E testleri
- `npm run anvil` - Yerel Ethereum düğümü (sözleşme testleri için)

## Mimari

- **Oyun**: `public/eat-grow.html` (HTML5 iframe)
- **UI**: Next.js 15 + React + TypeScript
- **Veri**: Redis (üretim) + bellek içi cache (geliştirme)
- **Blockchain**: **Base Mainnet** ağı + OnchainKit

## OnchainKit Entegrasyonu

Bu proje [Base OnchainKit](https://www.base.org/build/onchainkit) kullanarak **Base Mainnet** ağında onchain özellikler sağlar:

- **OnchainKitProvider**: `app/rootProvider.tsx`'de Base ağı için yapılandırılmış
- **Cüzdan Bağlantısı**: `app/_contexts/UserContext.tsx` üzerinden Wagmi hook'ları ile
- **İşlem Yönetimi**: Sözleşme etkileşimleri için hazır

Detaylı OnchainKit kullanımı için [Base OnchainKit Rehberi](https://www.base.org/build/onchainkit)'ne bakın.

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Geliştirme Rehberi

### Kod Standartları

- **TypeScript**: Tüm yeni kod TypeScript ile yazılmalı
- **ESLint**: Kod kalitesi için ESLint kuralları uygulanır
- **Prettier**: Kod formatlaması için Prettier kullanılır

### Ana Dosyalar

- `app/page.tsx` - Ana sayfa yönlendirmesi
- `app/login/page.tsx` - Giriş sayfası
- `app/game/page.tsx` - Oyun sayfası
- `app/admin/page.tsx` - Admin paneli
- `lib/config.ts` - Oyun konfigürasyonu
- `lib/user-store.ts` - Kullanıcı yönetimi
- `public/eat-grow.html` - HTML5 Snake oyunu

### Test Çalıştırma

```bash
# Birim testleri
npm test

# E2E testleri
npm run test:e2e

# Sözleşme testleri
npm run test:blockchain
```

### Ortam Değişkenleri

Geliştirme için `.env` dosyası oluşturun (`.example.env`'den kopyalayın):

```env
# Session Security (Required)
SECRET_COOKIE_PASSWORD=your_32_plus_character_secret_here

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Base Mainnet Ağ Konfigürasyonu
NEXT_PUBLIC_BLOCKCHAIN_ENABLED=true
NEXT_PUBLIC_GAME_CONTRACT_ADDRESS=your_deployed_contract_address_on_base_mainnet

# Service Wallet (On-chain submissions için)
SERVICE_WALLET_PRIVATE_KEY=0x_your_service_wallet_private_key

# Base Mainnet RPC
BASE_RPC_URL=https://mainnet.base.org

# Diğer
NEXT_PUBLIC_BLOCKCHAIN_ENABLED=true
```

**Güvenlik Notu:** `SECRET_COOKIE_PASSWORD` en az 32 karakter uzunluğunda olmalıdır. Aşağıdaki komutla güvenli bir şifre oluşturabilirsiniz:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

