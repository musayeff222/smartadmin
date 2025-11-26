# Şifre Sorunu - "Kayıtlı Şifreniz Kötü Olun" Hatası

## Sorun
Admin girişi yaparken "kayıtlı şifreniz kötü olun" veya "şifreniz sızılmış" gibi bir hata alıyorsunuz ve giriş yapamıyorsunuz.

## Neden Oluyor?
Bu hata genellikle:
1. Veritabanındaki şifre hash'i yanlış veya eksik
2. Şifre hash'i düzgün oluşturulmamış
3. Backend şifre karşılaştırması başarısız oluyor

## Çözüm

### Yöntem 1: Backend Seed Script ile (Önerilen)

Backend terminalinde:
```bash
cd backend
npm run seed
```

Bu komut:
- Doğru şifre hash'ini oluşturur
- Admin kullanıcısını oluşturur veya günceller
- Şifre: `admin123`

### Yöntem 2: SQL ile Manuel Düzeltme

1. **phpMyAdmin'de SQL sekmesine gidin**

2. **Şu SQL'i çalıştırın:**

```sql
USE pos_website;

-- Mevcut admin'i güncelle
UPDATE users 
SET 
  password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  role = 'super_admin',
  isActive = 1
WHERE email = 'admin@posrestaurant.com';

-- Eğer kullanıcı yoksa oluştur
INSERT INTO users (id, email, password, firstName, lastName, role, isActive, createdAt, updatedAt)
SELECT 
  UUID(),
  'admin@posrestaurant.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Super',
  'Admin',
  'super_admin',
  1,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@posrestaurant.com'
);
```

3. **Kontrol edin:**
```sql
SELECT email, role, isActive, LENGTH(password) as hash_length 
FROM users 
WHERE email = 'admin@posrestaurant.com';
```

`hash_length` 60 olmalı (bcrypt hash uzunluğu).

### Yöntem 3: Yeni Hash Oluşturma

Eğer yukarıdaki hash çalışmazsa:

1. Backend terminalinde:
```bash
cd backend
node generate-password-hash.js
```

2. Çıkan hash'i kopyalayın
3. SQL'deki password alanına yapıştırın

## Test

1. Backend terminalinde login loglarını kontrol edin
2. Tarayıcı console'unda (F12) hata mesajlarını kontrol edin
3. Giriş yapmayı tekrar deneyin:
   - Email: `admin@posrestaurant.com`
   - Şifre: `admin123`

## Önemli Notlar

- Şifre hash'i bcrypt ile oluşturulmalı (60 karakter)
- Her hash farklıdır, ama aynı şifre için doğrulama çalışır
- Veritabanındaki password alanı VARCHAR(255) olmalı
- Backend'de bcrypt.compare() kullanılıyor

## Sorun Devam Ederse

1. Backend terminalinde login loglarını kontrol edin
2. Veritabanındaki password alanını kontrol edin
3. `fix-admin-password.sql` dosyasını kullanın





