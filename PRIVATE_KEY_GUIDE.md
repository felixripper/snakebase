# 🔐 Private Key'i Güvenli Şekilde Ekleme Rehberi

## Yöntem 1: Manuel Ekleme (Basit)

### Adım 1: MetaMask'tan Private Key Al
1. MetaMask'ı aç
2. Account menüsü → **Account details**
3. **Show private key** → Şifreni gir
4. Private key'i kopyala

### Adım 2: .env.local Dosyasını Düzenle
```bash
# Terminalden:
nano .env.local

# veya VS Code'da:
code .env.local
```

### Adım 3: Private Key'i Yapıştır
Dosyada şu satırı bul:
```bash
# DEPLOYER_PRIVATE_KEY=your_private_key_here_without_0x_prefix
```

`#` işaretini kaldır ve private key'ini yapıştır (0x OLMADAN):
```bash
DEPLOYER_PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### Adım 4: Kaydet ve Kapat
- Nano: `Ctrl+X` → `Y` → `Enter`
- VS Code: `Ctrl+S`

---

## Yöntem 2: Otomatik Script (Kolay)

```bash
# Script'i çalıştır:
bash add-private-key.sh

# Private key'ini yapıştır (gizli kalır)
# Enter'a bas
# Bitti! ✅
```

---

## 🔒 Güvenlik Kontrol Listesi

✅ **YAPILMASI GEREKENLER:**
- ✅ Private key'i sadece `.env.local` dosyasına ekle
- ✅ 0x olmadan ekle (sadece 64 karakter)
- ✅ `.env.local` zaten `.gitignore`'da
- ✅ Deploy ettikten sonra contract adresini de ekle

❌ **ASLA YAPMAYIN:**
- ❌ `.env.local` dosyasını GitHub'a commit etmeyin
- ❌ Private key'i Discord/Slack'e yapıştırmayın
- ❌ Screenshot çekip paylaşmayın
- ❌ `.env` veya `.env.production` kullanmayın (bunlar public olabilir)
- ❌ Kod içine hardcode etmeyin

---

## 📝 Örnek .env.local Dosyası

```bash
# Admin Panel
SECRET_COOKIE_PASSWORD=your_secret_cookie_password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password

# OnchainKit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key

# Blockchain - DEPLOYMENT
DEPLOYER_PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
BASE_RPC_URL=https://mainnet.base.org

# Blockchain - FRONTEND
NEXT_PUBLIC_BLOCKCHAIN_ENABLED=false
# NEXT_PUBLIC_GAME_CONTRACT=0x...  # Deploy ettikten sonra ekle
NEXT_PUBLIC_CHAIN_ID=8453
```

---

## 🚀 Deploy Etme

Private key'i ekledikten sonra:

```bash
# 1. Wallet'ınızda Base ETH olduğundan emin olun (~$5)
# 2. Contract'ı deploy edin:
npm run deploy:base

# 3. Deploy çıktısından contract adresini kopyalayın
# 4. .env.local'e ekleyin:
NEXT_PUBLIC_BLOCKCHAIN_ENABLED=true
NEXT_PUBLIC_GAME_CONTRACT=0xYourContractAddress

# 5. Vercel'e de ekleyin (Environment Variables)
```

---

## ⚠️ Private Key Sızdı mı?

Eğer private key yanlışlıkla GitHub'a gittiyse:

1. **Hemen yeni bir wallet oluştur**
2. **Eski wallet'taki tüm varlıkları transfer et**
3. **Eski private key'i bir daha kullanma**
4. **GitHub'da hassas veriyi temizle:**
   ```bash
   # History'den temizle (tehlikeli - dikkatli kullan)
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all
   
   git push origin --force --all
   ```

---

## 🔍 Kontrol Komutları

```bash
# Private key doğru formatta mı?
grep DEPLOYER_PRIVATE_KEY .env.local

# .env.local .gitignore'da mı?
grep ".env" .gitignore

# .env.local GitHub'da yok mu? (boş çıktı olmalı)
git ls-files | grep .env.local

# Güvenlik kontrolü yap:
bash /tmp/security_check.sh
```

---

## 💡 En İyi Pratikler

1. **Deployment Wallet Kullan**
   - Sadece deploy için ayrı bir wallet kullanın
   - Ana cüzdanınızı kullanmayın
   - Minimal ETH tutun (sadece gas için)

2. **Environment Variables Yönetimi**
   - Local: `.env.local` (gitignore'da)
   - Production: Vercel Environment Variables
   - CI/CD: GitHub Secrets

3. **Yedekleme**
   - Private key'i güvenli bir yerde saklayın
   - Password manager kullanın (1Password, Bitwarden)
   - Fiziksel yedek alın (kağıt, USB)

---

## 🆘 Yardım

Sorun mu yaşıyorsunuz?

```bash
# Test et:
npx hardhat compile

# Wallet balance kontrol:
npx hardhat run scripts/check-balance.js --network base

# Deploy test (testnet):
npm run deploy:baseSepolia
```

**Herhangi bir hata alırsanız error mesajını paylaşın!**
