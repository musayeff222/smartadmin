# 🚀 Hızlı Başlangıç Kılavuzu

Bu kılavuz, projeyi en hızlı şekilde çalıştırmanız için adım adım talimatlar içerir.

> 💡 **XAMPP Kullanıyorsanız:** [XAMPP-KURULUM.md](./XAMPP-KURULUM.md) dosyasına bakın! Proje artık XAMPP (MySQL) ile çalışacak şekilde yapılandırıldı.

## ⚡ Hızlı Başlangıç (5 Dakika)

### 1️⃣ Gereksinimleri Kontrol Edin

Aşağıdaki programların yüklü olduğundan emin olun:

- ✅ **Node.js** (v18 veya üzeri) - [İndir](https://nodejs.org/)
- ✅ **XAMPP** (MySQL için) - [İndir](https://www.apachefriends.org/) **VEYA** **PostgreSQL** (v12 veya üzeri) - [İndir](https://www.postgresql.org/download/)
- ✅ **npm** (Node.js ile birlikte gelir)

Kontrol etmek için terminalde şu komutları çalıştırın:
```bash
node --version
npm --version
psql --version
```

### 2️⃣ PostgreSQL Veritabanını Hazırlayın

**Windows için:**
1. PostgreSQL servisinin çalıştığından emin olun
2. pgAdmin veya terminalden veritabanı oluşturun:

```sql
-- PostgreSQL terminalinde veya pgAdmin'de çalıştırın
CREATE DATABASE pos_website;
```

**Alternatif olarak terminalden:**
```bash
psql -U postgres
CREATE DATABASE pos_website;
\q
```

### 3️⃣ Backend'i Kurun ve Çalıştırın

**Terminal 1'i açın ve şu komutları çalıştırın:**

```bash
# Proje klasörüne gidin
cd C:\Users\User\Desktop\smartadmin\backend

# Bağımlılıkları yükleyin
npm install

# .env dosyası oluşturun (Windows'ta)
copy .env.example .env

# .env dosyasını düzenleyin ve PostgreSQL bilgilerinizi girin
# Notepad veya herhangi bir editörle açın:
notepad .env
```

**.env dosyasında şunları değiştirin:**
```
DB_USERNAME=postgres          # PostgreSQL kullanıcı adınız
DB_PASSWORD=sizin_sifreniz    # PostgreSQL şifreniz
DB_NAME=pos_website           # Veritabanı adı (zaten oluşturduk)
```

**Sonra şu komutları çalıştırın:**
```bash
# Veritabanını seed edin (ilk admin kullanıcısı ve örnek paketler)
npm run seed

# Backend sunucusunu başlatın
npm run dev
```

✅ Backend `http://localhost:5000` adresinde çalışıyor olmalı!

### 4️⃣ Frontend'i Kurun ve Çalıştırın

**YENİ bir terminal açın (Terminal 2) ve şu komutları çalıştırın:**

```bash
# Frontend klasörüne gidin
cd C:\Users\User\Desktop\smartadmin\frontend

# Bağımlılıkları yükleyin
npm install

# Frontend sunucusunu başlatın
npm run dev
```

✅ Frontend `http://localhost:3000` adresinde çalışıyor olmalı!

### 5️⃣ Tarayıcıda Açın

1. Tarayıcınızda şu adresi açın: **http://localhost:3000**
2. Ana sayfayı göreceksiniz
3. Admin paneline giriş yapmak için: **http://localhost:3000/admin/login**

**Giriş Bilgileri:**
- 📧 Email: `admin@posrestaurant.com`
- 🔑 Şifre: `admin123`

---

## 📋 Detaylı Adımlar

### Backend Kurulumu (Detaylı)

```bash
# 1. Backend klasörüne gidin
cd backend

# 2. Bağımlılıkları yükleyin (ilk seferinde 2-3 dakika sürebilir)
npm install

# 3. .env dosyası oluşturun
# Windows:
copy .env.example .env
# Mac/Linux:
cp .env.example .env

# 4. .env dosyasını düzenleyin
# Önemli: DB_USERNAME ve DB_PASSWORD değerlerini kendi PostgreSQL bilgilerinizle değiştirin

# 5. Veritabanını seed edin (ilk admin kullanıcısı oluşturur)
npm run seed

# 6. Backend'i başlatın
npm run dev
```

**Başarılı olduysa şunu göreceksiniz:**
```
Database connected successfully
Server is running on port 5000
```

### Frontend Kurulumu (Detaylı)

```bash
# 1. YENİ bir terminal açın ve frontend klasörüne gidin
cd frontend

# 2. Bağımlılıkları yükleyin
npm install

# 3. Frontend'i başlatın
npm run dev
```

**Başarılı olduysa şunu göreceksiniz:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## 🔧 Sorun Giderme

### ❌ "Cannot find module" hatası
```bash
# Backend veya frontend klasöründe tekrar bağımlılıkları yükleyin
npm install
```

### ❌ Veritabanı bağlantı hatası
1. PostgreSQL servisinin çalıştığından emin olun
2. `.env` dosyasındaki bilgileri kontrol edin:
   - `DB_USERNAME` doğru mu?
   - `DB_PASSWORD` doğru mu?
   - `DB_NAME=pos_website` var mı?
3. Veritabanının oluşturulduğundan emin olun

### ❌ Port 5000 veya 3000 zaten kullanımda
**Backend için:**
- `.env` dosyasında `PORT=5001` gibi farklı bir port kullanın

**Frontend için:**
- `vite.config.ts` dosyasında port değiştirin veya terminalde:
```bash
npm run dev -- --port 3001
```

### ❌ "npm: command not found"
- Node.js'in yüklü olduğundan emin olun
- Terminali kapatıp yeniden açın
- Node.js'i [buradan](https://nodejs.org/) indirin

### ❌ Seed script çalışmıyor
```bash
# Önce veritabanının oluşturulduğundan emin olun
# Sonra .env dosyasındaki bilgileri kontrol edin
# Tekrar deneyin:
npm run seed
```

---

## ✅ Başarı Kontrolü

Her şey çalışıyorsa:

1. ✅ Backend terminalinde: "Server is running on port 5000"
2. ✅ Frontend terminalinde: "Local: http://localhost:3000/"
3. ✅ Tarayıcıda http://localhost:3000 açılıyor
4. ✅ Admin paneline giriş yapabiliyorsunuz

---

## 🎯 Sonraki Adımlar

1. **Şifrenizi değiştirin:** Admin panelinde kullanıcı yönetiminden şifrenizi güncelleyin
2. **Paketleri düzenleyin:** Admin panelinden paket içeriklerini ve fiyatlarını düzenleyin
3. **İçerikleri özelleştirin:** Site içeriklerini kendi metinlerinizle değiştirin

---

## 📞 Yardım

Sorun yaşıyorsanız:
1. Hata mesajını tam olarak okuyun
2. Yukarıdaki "Sorun Giderme" bölümüne bakın
3. Terminal çıktılarını kontrol edin

**İyi çalışmalar! 🚀**

