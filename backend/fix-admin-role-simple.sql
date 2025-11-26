-- Admin Kullanıcısının Role'unu Düzelt
-- Bu script'i phpMyAdmin'de SQL sekmesinde çalıştırın
-- Sorun: Admin kullanıcısının role alanı boş veya null
-- Çözüm: Role'u 'super_admin' olarak ayarla

USE pos_website;

-- Önce mevcut durumu kontrol et
SELECT id, email, firstName, lastName, role, isActive 
FROM users 
WHERE email = 'admin@posrestaurant.com';

-- Admin kullanıcısının tüm eksik alanlarını düzelt
-- Bu komut role, firstName, lastName gibi eksik alanları düzeltir
UPDATE users 
SET role = 'super_admin',
    firstName = CASE WHEN firstName IS NULL OR firstName = '' THEN 'Super' ELSE firstName END,
    lastName = CASE WHEN lastName IS NULL OR lastName = '' THEN 'Admin' ELSE lastName END,
    isActive = TRUE,
    updatedAt = NOW()
WHERE email = 'admin@posrestaurant.com'
  AND (role IS NULL OR role = '' OR role NOT IN ('super_admin', 'admin', 'user')
       OR firstName IS NULL OR firstName = ''
       OR lastName IS NULL OR lastName = '');

-- Güncellemeden sonra kontrol et
SELECT id, email, firstName, lastName, role, isActive 
FROM users 
WHERE email = 'admin@posrestaurant.com';

-- Eğer kullanıcı hiç yoksa, yeni bir super admin oluştur
-- Şifre: admin123 (bcrypt hash)
INSERT INTO users (id, email, password, firstName, lastName, role, isActive, createdAt, updatedAt)
SELECT 
  UUID(),
  'admin@posrestaurant.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- admin123 hash
  'Super',
  'Admin',
  'super_admin',
  TRUE,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@posrestaurant.com'
);

-- Son kontrol
SELECT 
  id, 
  email, 
  firstName, 
  lastName, 
  role, 
  isActive,
  CASE 
    WHEN role IS NULL THEN '❌ Role NULL'
    WHEN role = '' THEN '❌ Role BOŞ'
    WHEN role NOT IN ('super_admin', 'admin', 'user') THEN '❌ Role GEÇERSİZ'
    ELSE '✅ Role GEÇERLİ'
  END as durum
FROM users 
WHERE email = 'admin@posrestaurant.com';

