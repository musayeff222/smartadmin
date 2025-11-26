# 🚀 XAMPP MySQL - Hızlı Başlangıç

## ⚡ 5 Dakikada Kurulum

### 1️⃣ Veritabanını Oluşturun

**phpMyAdmin'de:**
1. XAMPP Control Panel → MySQL **Admin** butonuna tıklayın
2. Sol menüden **"New"** (Yeni) tıklayın
3. Veritabanı adı: `pos_website`
4. **"Create"** (Oluştur) butonuna tıklayın

### 2️⃣ Tabloları Oluşturun

**phpMyAdmin'de:**
1. `pos_website` veritabanını seçin
2. Üst menüden **SQL** sekmesine tıklayın
3. `backend/database-schema.sql` dosyasının **tüm içeriğini** kopyalayın
4. SQL alanına yapıştırın
5. **"Go"** (Git) butonuna tıklayın

✅ 5 tablo oluşturulmalı: users, packages, subscriptions, contact_messages, site_contents

### 3️⃣ Admin Kullanıcısını Oluşturun

**Seçenek A: Backend Seed Script (Önerilen)**

Backend terminalinde:
```bash
cd backend
npm run seed
```

**Seçenek B: Manuel SQL**

1. phpMyAdmin → SQL sekmesi
2. `backend/create-admin-simple.sql` dosyasının içeriğini kopyalayın
3. Yapıştırıp **"Go"** butonuna tıklayın

### 4️⃣ Backend'i Başlatın

```bash
cd backend
npm install  # İlk seferinde
npm run dev
```

✅ "Database connected successfully" mesajını görmelisiniz

### 5️⃣ Frontend'i Başlatın

Yeni terminal:
```bash
cd frontend
npm install  # İlk seferinde
npm run dev
```

### 6️⃣ Giriş Yapın

- Adres: http://localhost:3000/admin-panel/login
- Email: `admin@posrestaurant.com`
- Şifre: `admin123`

---

## 📋 Tablo Kontrolü

Tabloların oluşturulduğunu kontrol etmek için phpMyAdmin'de:

```sql
USE pos_website;
SHOW TABLES;
```

5 tablo görmelisiniz.

---

## 🔧 Sorun Giderme

### Tablolar oluşmuyor
- SQL script'ini tekrar çalıştırın
- Foreign key hataları varsa, script'i ikiye bölün (önce users ve packages, sonra subscriptions)

### Admin kullanıcısı oluşmuyor
- Backend terminalinde `npm run seed` çalıştırın
- Veya manuel SQL script'ini kullanın

### Backend bağlanamıyor
- `.env` dosyasındaki veritabanı bilgilerini kontrol edin
- MySQL servisinin çalıştığından emin olun (XAMPP Control Panel)

---

## ✅ Başarı Kontrolü

1. ✅ phpMyAdmin'de 5 tablo var
2. ✅ users tablosunda admin@posrestaurant.com kullanıcısı var
3. ✅ Backend terminalinde "Database connected successfully"
4. ✅ Frontend çalışıyor
5. ✅ Admin paneline giriş yapabiliyorsunuz

**Hazırsınız! 🎉**





