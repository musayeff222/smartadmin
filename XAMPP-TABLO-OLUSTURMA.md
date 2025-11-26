# XAMPP MySQL Tablo Oluşturma Kılavuzu

## Sorun
TypeORM tabloları otomatik oluşturmuyor. Manuel olarak oluşturmanız gerekiyor.

## Çözüm 1: SQL Script ile Otomatik Oluşturma (Önerilen)

### Adım 1: phpMyAdmin'de SQL Script'i Çalıştırın

1. XAMPP Control Panel'de MySQL'in yanındaki **Admin** butonuna tıklayın
2. Sol menüden `pos_website` veritabanını seçin (yoksa oluşturun)
3. Üst menüden **SQL** sekmesine tıklayın
4. `backend/database-schema.sql` dosyasının içeriğini kopyalayıp yapıştırın
5. **Git** (Çalıştır) butonuna tıklayın

### Adım 2: Admin Kullanıcısını Oluşturun

**Yöntem A: Backend Seed Script ile (Kolay)**

Backend terminalinde:
```bash
cd backend
npm run seed
```

**Yöntem B: Manuel SQL ile**

1. phpMyAdmin'de SQL sekmesine gidin
2. Şu komutu çalıştırın (şifre hash'ini backend'den alın):

```sql
USE pos_website;

-- Şifre hash'ini backend'den almak için:
-- Backend terminalinde: node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"

INSERT INTO users (id, email, password, firstName, lastName, role, isActive)
VALUES (
  UUID(),
  'admin@posrestaurant.com',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', -- Backend'den alınan hash
  'Super',
  'Admin',
  'super_admin',
  TRUE
);
```

## Çözüm 2: TypeORM Synchronize'i Aktif Etme

Backend'de `.env` dosyasında:
```
NODE_ENV=development
```

`data-source.ts` dosyasında `synchronize: true` olmalı (zaten var).

Backend'i başlattığınızda tablolar otomatik oluşmalı. Eğer oluşmuyorsa:

1. Backend'i durdurun
2. Veritabanını silin (phpMyAdmin'den)
3. Veritabanını yeniden oluşturun
4. Backend'i başlatın

## Çözüm 3: Manuel Tablo Oluşturma

Eğer yukarıdaki yöntemler çalışmazsa, `database-schema.sql` dosyasındaki SQL komutlarını tek tek phpMyAdmin'de çalıştırabilirsiniz.

## Tablolar

Oluşturulması gereken tablolar:

1. **users** - Kullanıcılar
2. **packages** - Paketler
3. **subscriptions** - Abonelikler
4. **contact_messages** - İletişim mesajları
5. **site_contents** - Site içerikleri

## Kontrol

Tabloların oluşturulduğunu kontrol etmek için:

```sql
USE pos_website;
SHOW TABLES;
```

5 tablo görmelisiniz:
- users
- packages
- subscriptions
- contact_messages
- site_contents

## Admin Kullanıcısı Kontrolü

```sql
SELECT email, role FROM users WHERE email = 'admin@posrestaurant.com';
```

Sonuç:
```
email                      | role
---------------------------|------------
admin@posrestaurant.com    | super_admin
```

## Sorun Giderme

### Tablolar oluşmuyor
- Veritabanının oluşturulduğundan emin olun
- MySQL servisinin çalıştığından emin olun
- Backend'in veritabanına bağlanabildiğinden emin olun

### Foreign Key hatası
- Tabloları doğru sırayla oluşturun (users ve packages önce, subscriptions sonra)
- Veya foreign key kontrolünü geçici olarak kapatın:
```sql
SET FOREIGN_KEY_CHECKS = 0;
-- Tabloları oluştur
SET FOREIGN_KEY_CHECKS = 1;
```

### UUID hatası
- MySQL'de UUID() fonksiyonu kullanılıyor
- Eğer hata alırsanız, manuel UUID oluşturabilirsiniz veya auto-increment kullanabilirsiniz





