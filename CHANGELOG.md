# Changelog

Tüm önemli değişiklikler bu dosyada belgelenir.

Format [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standardını takip eder,
ve bu proje [Semantic Versioning](https://semver.org/spec/v2.0.0.html) kullanır.

## [Unreleased]

### Added

- Kapsamlı `.env.example` dosyası tüm gerekli environment variables ile
- API endpoint authentication middleware (`lib/auth.ts`)
- `/api/config` ve `/api/game-config` için POST/PUT method desteği
- MIT License
- CONTRIBUTING.md katkıda bulunma rehberi
- CHANGELOG.md
- `.nvmrc` dosyası (Node.js 20)
- `.gitattributes` dosyası
- Prettier konfigürasyonu
- Detaylı README.md (Türkçe)

### Changed

- Admin API endpoints artık authentication gerektiriyor
- Middleware iyileştirildi, session doğrulaması eklendi
- package.json metadata (author, repository, keywords, vs.)

### Fixed

- `/api/config` POST/PUT method tutarsızlığı düzeltildi
- ESLint çift konfigürasyon sorunu giderildi (.eslintrc.json kaldırıldı)

### Security

- API endpoints artık korumalı (requireAuth middleware)
- Session validation eklendi

## [0.1.0] - 2025-10-25

### Added

- İlk release
- Snake oyunu (eat-grow.html)
- Admin panel (`/admin` ve `/admin/settings`)
- Redis/In-memory configuration storage
- Farcaster Mini App entegrasyonu
- Base blockchain smart contract (GameScore.sol)
- OnchainKit entegrasyonu

[Unreleased]: https://github.com/felixripper/snakebase/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/felixripper/snakebase/releases/tag/v0.1.0
