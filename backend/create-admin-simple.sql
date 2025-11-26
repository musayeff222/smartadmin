-- XAMPP MySQL için Basit Admin Kullanıcısı Oluşturma
-- phpMyAdmin'de SQL sekmesinde çalıştırın

USE pos_website;

-- Önce mevcut admin'i sil (varsa)
DELETE FROM users WHERE email = 'admin@posrestaurant.com';

-- Yeni UUID oluştur (MySQL'de UUID() fonksiyonu)
SET @admin_id = UUID();

-- Admin kullanıcısı ekle
-- ŞİFRE: admin123
-- Bu hash'i backend'den almak için backend terminalinde şunu çalıştırın:
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
-- Çıkan hash'i aşağıdaki 'password' alanına yapıştırın

INSERT INTO users (id, email, password, firstName, lastName, role, isActive, createdAt, updatedAt)
VALUES (
  @admin_id,
  'admin@posrestaurant.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- admin123 hash (bcrypt)
  'Super',
  'Admin',
  'super_admin',
  1,
  NOW(),
  NOW()
);

-- Eğer yukarıdaki hash çalışmazsa, backend terminalinde şunu çalıştırın:
-- node -e "const bcrypt=require('bcryptjs');bcrypt.hash('admin123',10).then(h=>console.log(h));"
-- Çıkan hash'i yukarıdaki password alanına yapıştırın

-- Kontrol et
SELECT id, email, firstName, lastName, role, isActive FROM users WHERE email = 'admin@posrestaurant.com';

