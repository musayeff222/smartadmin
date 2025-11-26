# Role Sorunu Çözümü

## Sorun
Login başarılı oluyor ancak `role: ''` (boş) görünüyor ve admin paneline giriş yapılamıyor.

## Çözüm Adımları

### 1. Veritabanında Role'u Kontrol Et

XAMPP phpMyAdmin'de şu sorguyu çalıştırın:

```sql
SELECT id, email, role, isActive FROM users WHERE email = 'admin@posrestaurant.com';
```

Eğer `role` sütunu boş veya NULL ise, aşağıdaki adımları izleyin.

### 2. Role'u Düzelt

**Seçenek A: SQL Script ile (Önerilen)**

`backend/fix-admin-role.sql` dosyasını phpMyAdmin'de çalıştırın. Bu script:
- Mevcut admin kullanıcısının role'unu `admin` olarak günceller
- Eğer kullanıcı yoksa yeni bir admin kullanıcısı oluşturur

**Seçenek B: Manuel Güncelleme**

phpMyAdmin'de şu sorguyu çalıştırın:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@posrestaurant.com';
```

**Super Admin İçin:**

```sql
UPDATE users 
SET role = 'super_admin' 
WHERE email = 'admin@posrestaurant.com';
```

### 3. Veritabanı Şemasını Kontrol Et

`users` tablosundaki `role` sütununun tipini kontrol edin:

```sql
DESCRIBE users;
```

`role` sütunu `ENUM('super_admin', 'admin', 'user')` veya `VARCHAR` olmalı.

Eğer farklıysa, `backend/database-schema.sql` dosyasını kullanarak tabloyu yeniden oluşturun.

### 4. Backend'i Yeniden Başlat

Değişikliklerden sonra backend'i yeniden başlatın:

```bash
cd backend
npm run dev
```

### 5. Frontend'i Yeniden Başlat

Frontend'i de yeniden başlatın:

```bash
cd frontend
npm run dev
```

### 6. Test Et

1. Tarayıcı konsolunu açın (F12)
2. `/admin-panel/login` sayfasına gidin
3. Admin bilgileriyle giriş yapın:
   - Email: `admin@posrestaurant.com`
   - Şifre: `admin123`
4. Konsolda şu logları kontrol edin:
   - `Login attempt - User found:` - role değerini kontrol edin
   - `Login response - User role:` - role'un string olarak döndüğünü kontrol edin
   - `AuthContext - User with role:` - role'un frontend'de doğru olduğunu kontrol edin

### 7. Sorun Devam Ederse

Eğer sorun devam ederse:

1. **Tarayıcı Cache'ini Temizle:**
   - Ctrl+Shift+Delete
   - "Cached images and files" seçeneğini işaretleyin
   - "Clear data" butonuna tıklayın

2. **localStorage'ı Temizle:**
   - Tarayıcı konsolunda:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

3. **Veritabanını Kontrol Et:**
   ```sql
   -- Tüm kullanıcıları ve role'larını listele
   SELECT id, email, role, isActive FROM users;
   
   -- Role'u olmayan kullanıcıları bul
   SELECT * FROM users WHERE role IS NULL OR role = '';
   ```

## Önemli Notlar

- MySQL'de enum değerleri case-sensitive değildir, ancak string olarak saklanır
- Backend'de role enum'dan string'e çevrilerek döndürülüyor
- Frontend'de role string olarak işleniyor ve lowercase'e çevriliyor
- `window.location.href` kullanarak kesin yönlendirme yapılıyor

## Hata Mesajları

- **"Kullanıcı rolü tanımlı değil"**: Veritabanında role boş veya NULL
- **"Bu sayfaya erişmek için admin yetkisi gerekiyor"**: Role 'admin' veya 'super_admin' değil
- **"Login successful but not entering admin"**: Role boş veya yanlış

## İletişim

Sorun devam ederse, konsol loglarını ve veritabanı sorgu sonuçlarını paylaşın.





