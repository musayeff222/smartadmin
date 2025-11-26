-- Super Admin Kullanıcısı Oluştur
-- Bu dosyayı phpMyAdmin'de veya MySQL terminalinde çalıştırabilirsiniz
-- Şifre: admin123 (bcrypt hash)

USE pos_website;

-- Eğer kullanıcı varsa sil
DELETE FROM users WHERE email = 'admin@posrestaurant.com';

-- Super Admin kullanıcısı ekle
-- Şifre: admin123 (bcrypt hash)
INSERT INTO users (id, email, password, firstName, lastName, role, isActive, createdAt, updatedAt)
VALUES (
  UUID(),
  'admin@posrestaurant.com',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', -- Bu hash'i backend'den alacaksınız
  'Super',
  'Admin',
  'super_admin',
  TRUE,
  NOW(),
  NOW()
);

-- Not: Şifre hash'ini backend'den almak için:
-- Backend terminalinde: node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"





