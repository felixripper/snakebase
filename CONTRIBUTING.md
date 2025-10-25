# Katkıda Bulunma Rehberi / Contributing Guide

Snakebase projesine katkıda bulunmak istediğiniz için teşekkür ederiz! 🎉

## 🚀 Başlarken

### 1. Projeyi Fork Edin

GitHub'da projeyi fork edin ve yerel makinenize klonlayın:

```bash
git clone https://github.com/YOUR-USERNAME/snakebase.git
cd snakebase
```

### 2. Upstream Remote Ekleyin

```bash
git remote add upstream https://github.com/felixripper/snakebase.git
```

### 3. Development Environment Kurulumu

```bash
# Bağımlılıkları yükleyin
npm install

# .env.local dosyası oluşturun
cp .example.env .env.local

# Gerekli environment variables'ları doldurun
# (Detaylar için README.md'ye bakın)

# Development sunucusunu başlatın
npm run dev
```

## 📝 Geliştirme Süreci

### 1. Branch Oluşturun

Her yeni özellik veya düzeltme için yeni bir branch oluşturun:

```bash
git checkout -b feature/amazing-feature
# veya
git checkout -b fix/bug-description
```

Branch isimlendirme kuralları:

- `feature/` - Yeni özellikler için
- `fix/` - Bug düzeltmeleri için
- `docs/` - Dokümantasyon güncellemeleri için
- `refactor/` - Code refactoring için
- `test/` - Test eklemeleri için

### 2. Değişikliklerinizi Yapın

- Kod kalitesini koruyun
- TypeScript tip güvenliğine dikkat edin
- Mevcut kod stiline uygun yazın

### 3. Test Edin

```bash
# Lint kontrolü
npm run lint

# Build testi
npm run build

# Development modda test edin
npm run dev
```

### 4. Commit Yapın

Anlamlı commit mesajları yazın. Conventional Commits formatını kullanmayı öneririz:

```bash
git commit -m "feat: Add new game mode"
git commit -m "fix: Resolve admin panel login issue"
git commit -m "docs: Update README installation steps"
git commit -m "refactor: Improve config management"
```

Commit mesajı formatı:

- `feat:` - Yeni özellik
- `fix:` - Bug düzeltmesi
- `docs:` - Dokümantasyon değişikliği
- `style:` - Kod formatı (işlevselliği etkilemeyen)
- `refactor:` - Code refactoring
- `test:` - Test eklemesi
- `chore:` - Konfigürasyon, bağımlılık güncellemeleri

### 5. Push ve Pull Request

```bash
# Branch'inizi push edin
git push origin feature/amazing-feature
```

GitHub'da Pull Request açın:

1. Açıklayıcı bir başlık yazın
2. Yaptığınız değişiklikleri detaylı açıklayın
3. İlgili issue'ları referans verin (varsa)
4. Ekran görüntüleri ekleyin (UI değişikliği varsa)

## 🎨 Kod Stili

### TypeScript

- Strict mode kullanın
- Tip tanımlamalarını atlayın (TypeScript inference kullanın)
- `any` kullanmaktan kaçının
- Anlamlı değişken isimleri kullanın

### React/Next.js

- Fonksiyonel componentler kullanın
- Server ve Client componentleri doğru ayırın
- `"use client"` directive'ini sadece gerekli yerde kullanın

### Dosya Yapısı

```
app/
  ├── (feature)/          # Route group
  │   ├── page.tsx       # Page component
  │   └── layout.tsx     # Layout (opsiyonel)
  └── api/               # API routes
      └── (endpoint)/
          └── route.ts   # API handler

lib/                     # Utility functions
  └── utils.ts

components/              # Reusable components (eğer gerekirse)
  └── Button.tsx
```

## 🧪 Test Yazma (Gelecek)

Şu anda test infrastructure'ı yoktur, ancak eklenecektir. Test yazarken:

- Unit testler için Jest kullanın
- E2E testler için Playwright kullanın
- API testleri yazın
- Critical paths'i test edin

## 🐛 Bug Raporu

Bug bulduğunuzda lütfen aşağıdaki bilgileri içeren bir issue açın:

**Bug Açıklaması:**
Açık ve net bir açıklama

**Tekrarlama Adımları:**

1. '...' sayfasına git
2. '...' butonuna tıkla
3. '...' değerini gir
4. Hatayı gör

**Beklenen Davranış:**
Ne olmasını bekliyordunuz?

**Ekran Görüntüleri:**
Varsa ekran görüntüleri ekleyin

**Ortam:**

- Tarayıcı: [örn. Chrome 120]
- İşletim Sistemi: [örn. macOS 14]
- Node.js version: [örn. 20.10.0]

## 💡 Özellik İsteği

Yeni özellik önerileriniz için:

1. Önce bir issue açın
2. Özelliği detaylı açıklayın
3. Neden gerekli olduğunu belirtin
4. Mümkünse örnek kullanım senaryoları verin

## 📋 Pull Request Kontrol Listesi

PR açmadan önce:

- [ ] Kod değişiklikleri test edildi
- [ ] `npm run lint` hatasız çalışıyor
- [ ] `npm run build` başarılı
- [ ] Yeni özellikler README.md'ye eklendi (gerekirse)
- [ ] Commit mesajları anlamlı ve açıklayıcı
- [ ] Gereksiz console.log'lar kaldırıldı
- [ ] TypeScript hataları yok

## 🤝 Code Review Süreci

1. Maintainer'lar PR'ınızı inceleyecek
2. Gerekli değişiklikler istenebilir
3. Tüm kontroller geçtikten sonra merge edilecek

## 📞 İletişim

Sorularınız için:

- GitHub Issues kullanın
- Tartışmalar için GitHub Discussions
- Email: (eklenecek)

## 🙏 Teşekkürler

Her türlü katkınız değerlidir:

- Kod yazmak
- Dokümantasyon düzeltmek
- Bug raporlamak
- Özellik önermek
- Projeyi paylaşmak

**Hep birlikte daha iyi bir proje yaratıyoruz! 🚀**
