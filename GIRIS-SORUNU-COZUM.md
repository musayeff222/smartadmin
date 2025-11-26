# Giriş Başarılı Ama Admin Paneline Giriş Yapamıyor - Çözüm

## Sorun
"Giriş başarılı" mesajı görünüyor ama ardından "Bu sayfaya erişmek için admin yetkisi gerekiyor" hatası alınıyor.

## Neden Oluyor?
Bu hata, giriş yaptığınız kullanıcının rolünün **"user"** olduğunu gösteriyor. Admin paneline erişmek için kullanıcının rolü **"admin"** veya **"super_admin"** olmalı.

## Çözüm Adımları

### 1. Doğru Admin Kullanıcısı ile Giriş Yapın

**ÖNEMLİ:** Admin panel için şu bilgileri kullanın:

- **Email:** `admin@posrestaurant.com`
- **Şifre:** `admin123`

**DİKKAT:** Eğer başka bir email ile kayıt olduysanız, o kullanıcının rolü muhtemelen "user" olarak ayarlanmıştır.

### 2. Admin Kullanıcısının Oluşturulduğundan Emin Olun

Backend terminalinde şu komutu çalıştırın:

```bash
cd backend
npm run seed
```

Bu komut:
- Super admin kullanıcısı oluşturur (eğer yoksa)
- Email: `admin@posrestaurant.com`
- Şifre: `admin123`
- Rol: `super_admin`

### 3. Mevcut Kullanıcınızın Rolünü Kontrol Edin

**Tarayıcı Console'unda (F12) şu logları kontrol edin:**

```
AdminDashboard - User info: {
  user: { role: 'user' },  // <-- Bu 'admin' veya 'super_admin' olmalı
  ...
}
```

Eğer role: 'user' görüyorsanız, yanlış kullanıcı ile giriş yapmışsınız.

### 4. Çıkış Yapıp Tekrar Giriş Yapın

1. Admin panelden çıkış yapın (eğer giriş yapabildiyseniz)
2. Veya tarayıcı console'unda şunu çalıştırın:
   ```javascript
   localStorage.clear();
   location.reload();
   ```
3. Tekrar giriş yapın:
   - Email: `admin@posrestaurant.com`
   - Şifre: `admin123`

### 5. Kullanıcı Rolünü Değiştirme (Süper Admin Gerekli)

Eğer süper admin iseniz ve başka bir kullanıcının rolünü değiştirmek istiyorsanız:

1. Süper admin ile giriş yapın
2. Admin panel → Kullanıcılar
3. İlgili kullanıcıyı bulun
4. "Düzenle" butonuna tıklayın
5. Rol'ü "admin" veya "super_admin" olarak değiştirin

## Hızlı Test

Backend terminalinde şu SQL sorgusunu çalıştırabilirsiniz (phpMyAdmin veya MySQL terminal):

```sql
SELECT email, role FROM users WHERE email = 'admin@posrestaurant.com';
```

Sonuç şöyle olmalı:
```
email                      | role
---------------------------|------------
admin@posrestaurant.com    | super_admin
```

Eğer farklı bir sonuç görüyorsanız, seed script'i tekrar çalıştırın.

## Önemli Notlar

- Normal kullanıcılar (role: 'user') admin işlemleri yapamaz
- Sadece admin veya super_admin rolündeki kullanıcılar admin paneline erişebilir
- İlk kurulumda mutlaka `npm run seed` komutunu çalıştırın
- Giriş yaptıktan sonra console'da kullanıcı bilgilerini kontrol edin

## Debug İpuçları

Tarayıcı console'unda (F12) şu komutları çalıştırarak durumu kontrol edebilirsiniz:

```javascript
// Mevcut kullanıcıyı görüntüle
JSON.parse(localStorage.getItem('user'))

// Token'ı kontrol et
localStorage.getItem('token')

// Tüm auth bilgilerini temizle
localStorage.clear()
```





