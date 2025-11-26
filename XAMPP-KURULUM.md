# 🚀 XAMPP ile Kurulum Kılavuzu

Bu proje artık **XAMPP ile çalışacak şekilde** yapılandırıldı! MySQL veritabanı kullanıyor.

## ✅ Gereksinimler

- ✅ **XAMPP** - [İndir](https://www.apachefriends.org/download.html)
- ✅ **Node.js** (v18 veya üzeri) - [İndir](https://nodejs.org/)
- ✅ **npm** (Node.js ile birlikte gelir)

## 📋 Adım Adım Kurulum

### 1️⃣ XAMPP'i Kurun ve Başlatın

1. XAMPP'i indirip kurun
2. XAMPP Control Panel'i açın
3. **MySQL** servisini başlatın (Start butonuna tıklayın)
4. MySQL'in çalıştığını yeşil renkle göreceksiniz

### 2️⃣ MySQL Veritabanını Oluşturun

**Seçenek A: phpMyAdmin ile (Kolay)**

1. XAMPP Control Panel'de **MySQL**'in yanındaki **Admin** butonuna tıklayın
2. phpMyAdmin açılacak
3. Sol menüden **"New"** (Yeni) tıklayın
4. Veritabanı adı: `pos_website`
5. **"Create"** (Oluştur) butonuna tıklayın

**Seçenek B: Terminal ile**

```bash
# XAMPP'in MySQL'i genellikle şu yolda:
C:\xampp\mysql\bin\mysql.exe -u root

# MySQL terminalinde:
CREATE DATABASE pos_website;
EXIT;
```

### 3️⃣ Backend'i Kurun

**Terminal 1'i açın:**

```bash
# Proje klasörüne gidin
cd C:\Users\User\Desktop\smartadmin\backend

# Bağımlılıkları yükleyin
npm install
```

### 4️⃣ .env Dosyasını Oluşturun

`backend` klasöründe `.env` adında bir dosya oluşturun ve şu içeriği yapıştırın:

```env
# MySQL Configuration (XAMPP için)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=pos_website

# JWT Configuration
JWT_SECRET=super-secret-jwt-key-min-32-characters-long-change-this
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

**Önemli:** 
- `DB_PASSWORD` genellikle boş bırakılır (XAMPP varsayılan)
- Eğer MySQL'de şifre ayarladıysanız, şifrenizi yazın

### 5️⃣ Veritabanını Seed Edin

```bash
# İlk admin kullanıcısı ve örnek paketleri oluşturur
npm run seed
```

**Başarılı olduysa şunu göreceksiniz:**
```
Database connected
Super admin user created: admin@posrestaurant.com / admin123
Default packages created
Seeding completed!
```

### 6️⃣ Backend'i Başlatın

```bash
npm run dev
```

**Başarılı olduysa:**
```
Database connected successfully
Server is running on port 5000
```

✅ Backend hazır! Terminal 1'i açık bırakın.

### 7️⃣ Frontend'i Kurun

**YENİ bir terminal açın (Terminal 2):**

```bash
# Frontend klasörüne gidin
cd C:\Users\User\Desktop\smartadmin\frontend

# Bağımlılıkları yükleyin
npm install

# Frontend'i başlatın
npm run dev
```

**Başarılı olduysa:**
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

✅ Frontend hazır!

### 8️⃣ Tarayıcıda Açın

1. Tarayıcınızda şu adresi açın: **http://localhost:3000**
2. Ana sayfayı göreceksiniz! 🎉

**Admin Paneline Giriş:**
- Adres: **http://localhost:3000/admin/login**
- Email: `admin@posrestaurant.com`
- Şifre: `admin123`

---

## 🔧 Sorun Giderme

### ❌ "Access denied for user 'root'@'localhost'"

**Çözüm:**
1. XAMPP Control Panel'de MySQL'i durdurun
2. `C:\xampp\mysql\bin\my.ini` dosyasını açın
3. `[mysqld]` bölümüne şunu ekleyin:
   ```
   skip-grant-tables
   ```
4. MySQL'i yeniden başlatın
5. `.env` dosyasında `DB_PASSWORD=` boş bırakın

### ❌ "Can't connect to MySQL server"

**Çözüm:**
1. XAMPP Control Panel'de MySQL'in çalıştığından emin olun (yeşil olmalı)
2. Port 3306'nın başka bir program tarafından kullanılmadığından emin olun
3. MySQL'i durdurup yeniden başlatın

### ❌ "Database 'pos_website' doesn't exist"

**Çözüm:**
1. phpMyAdmin'de veritabanının oluşturulduğundan emin olun
2. Veritabanı adının tam olarak `pos_website` olduğunu kontrol edin

### ❌ Port 5000 veya 3000 zaten kullanımda

**Backend için:**
- `.env` dosyasında `PORT=5001` gibi farklı bir port kullanın

**Frontend için:**
```bash
npm run dev -- --port 3001
```

---

## ✅ Başarı Kontrolü

Her şey çalışıyorsa:

1. ✅ XAMPP Control Panel'de MySQL yeşil (çalışıyor)
2. ✅ Backend terminalinde: "Server is running on port 5000"
3. ✅ Frontend terminalinde: "Local: http://localhost:3000/"
4. ✅ Tarayıcıda http://localhost:3000 açılıyor
5. ✅ Admin paneline giriş yapabiliyorsunuz

---

## 📝 Önemli Notlar

1. **XAMPP'i her zaman çalıştırın:** Backend çalışırken MySQL servisinin açık olması gerekir
2. **İki terminal açık tutun:** Biri backend, biri frontend için
3. **İlk girişten sonra şifrenizi değiştirin:** Güvenlik için önemli!

---

## 🎯 Sonraki Adımlar

1. Admin panelinde paketleri düzenleyin
2. Site içeriklerini özelleştirin
3. İletişim mesajlarını kontrol edin

**İyi çalışmalar! 🚀**

