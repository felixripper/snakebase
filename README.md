# Waitlist Mini App Quickstart

This is a demo Mini App application built using OnchainKit and the Farcaster SDK. Build a waitlist sign-up mini app for your company that can be published to the Base app and Farcaster. 

> [!IMPORTANT]  
> Before interacting with this demo, please review our [disclaimer](#disclaimer) — there are **no official tokens or apps** associated with Cubey, Base, or Coinbase.

## Prerequisites

Before getting started, make sure you have:

* Base app account
* A [Farcaster](https://farcaster.xyz/) account
```markdown
# Snakebase — Game-only sürüm

Bu depo artık sadece oyun (Eat & Grow iframe) için sadeleştirilmiş bir versiyondur. Tüm cüzdan / on-chain entegrasyonları, akıllı sözleşme dosyaları ve ilgili dökümantasyon kaldırıldı.

Hızlı başlama (yerel geliştirme)

1. Depoyu klonlayın ve bağımlılıkları yükleyin:

```bash
git clone https://github.com/felixripper/snakebase.git
cd snakebase
npm install
```

2. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

3. Tarayıcıda açın: http://localhost:3000 — ana sayfa doğrudan oyunu yükler (iframe: `/public/eat-grow.html`).

Notlar
- Bu sürümde blokzincir ve cüzdan entegrasyonları tamamen kaldırıldı. Eğer geçmişteki repo sürümlerinde bulunan on-chain özellikleri kullanmak istiyorsanız lütfen eski commit geçmişine bakın.
- Konfigürasyon için `app/game-config.json` veya `/api/game-config` (varsa) kullanılabilir; basit kullanım için ekstra environment değişkenine gerek yoktur.

Yapı (build)

```bash
npm run build
```

Deploy

- Bu proje Vercel veya benzeri bir statik/Next hosting üzerinde rahatça çalışır. Deploy öncesi `NEXT_PUBLIC_URL` gibi temel environment değişkenlerini ayarlayın (isteğe bağlı).

Geliştirici notları
- `public/eat-grow.html` içindeki oyun iframe'idir. Oyun uygulaması iframe içinde çalışır ve ana sayfa sadece bu iframe'i render eder.
- Tüm on-chain dosyaları (contracts, hardhat, typechain vb.) ve ilgili dökümantasyon projeden kaldırıldı.

Destek veya katkı
- Projeye katkıda bulunmak veya sorun bildirmek için repository üzerinde yeni bir issue açabilirsiniz.

```

