-- Admin Kullanıcısı Şifresini Düzelt
-- phpMyAdmin'de SQL sekmesinde çalıştırın

USE pos_website;

-- Mevcut admin kullanıcısını güncelle
-- ŞİFRE: admin123
-- Bu hash backend seed script'i tarafından oluşturulur
-- Eğer manuel ekliyorsanız, backend terminalinde şunu çalıştırın:
-- node generate-password-hash.js

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

-- Kontrol et
SELECT 
  id, 
  email, 
  firstName, 
  lastName, 
  role, 
  isActive,
  LENGTH(password) as password_length
FROM users 
WHERE email = 'admin@posrestaurant.com';





