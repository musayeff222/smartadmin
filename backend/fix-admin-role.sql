-- Admin kullanıcısının role'unu düzelt
-- Bu script admin kullanıcısının role'unu 'admin' veya 'super_admin' olarak ayarlar

-- Önce mevcut admin kullanıcısını kontrol et
SELECT id, email, role, isActive FROM users WHERE email = 'admin@posrestaurant.com';

-- Admin kullanıcısının role'unu 'admin' olarak güncelle
-- Eğer super_admin istiyorsanız 'admin' yerine 'super_admin' yazın
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@posrestaurant.com';

-- Eğer kullanıcı yoksa, yeni bir admin kullanıcısı oluştur
-- Şifre: admin123 (bcrypt hash)
INSERT INTO users (id, email, password, firstName, lastName, role, isActive, createdAt, updatedAt)
VALUES (
  UUID(),
  'admin@posrestaurant.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  role = 'admin',
  isActive = true,
  updatedAt = NOW();

-- Güncellemeden sonra kontrol et
SELECT id, email, role, isActive FROM users WHERE email = 'admin@posrestaurant.com';





