# Admin Access Required Hatası - Çözüm

## Sorun
Paket eklerken "Admin access required" hatası alıyorsunuz.

## Neden Oluyor?
Bu hata, giriş yaptığınız kullanıcının rolünün "user" olduğunu gösteriyor. Admin işlemleri için "admin" veya "super_admin" rolü gerekiyor.

## Çözüm Adımları

### 1. Doğru Admin Kullanıcısı ile Giriş Yapın

**Admin Giriş Bilgileri:**
- Email: `admin@posrestaurant.com`
- Şifre: `admin123`

### 2. Eğer Admin Kullanıcısı Yoksa

Backend terminalinde şu komutu çalıştırın:
```bash
cd backend
npm run seed
```

Bu komut:
- Super admin kullanıcısı oluşturur
- Örnek paketler ekler

### 3. Mevcut Kullanıcınızın Rolünü Kontrol Edin

Admin panelde kullanıcı bilgilerinizi görmek için:
1. Tarayıcı console'unu açın (F12)
2. Network sekmesine gidin
3. Paket ekleme isteğini yapın
4. Response'da hata mesajını kontrol edin

Veya backend terminalinde şu logları göreceksiniz:
```
User role check: {
  userId: '...',
  userEmail: '...',
  userRole: 'user',  // <-- Bu 'admin' veya 'super_admin' olmalı
  ...
}
```

### 4. Kullanıcı Rolünü Değiştirme (Süper Admin Gerekli)

Eğer süper admin iseniz, admin panelden kullanıcı yönetimi sayfasından kullanıcı rolünü değiştirebilirsiniz.

### 5. Yeni Admin Kullanıcısı Oluşturma

Süper admin olarak giriş yaptıysanız:
1. Admin panel → Kullanıcılar
2. "Yeni Kullanıcı Ekle" butonuna tıklayın
3. Rol olarak "admin" veya "super_admin" seçin

## Hızlı Test

Backend terminalinde şu endpoint'i test edebilirsiniz:
```
GET http://localhost:5000/api/admin/me
```

Bu endpoint mevcut kullanıcı bilgilerinizi gösterir.

## Önemli Notlar

- Normal kullanıcılar (role: 'user') admin işlemleri yapamaz
- Sadece admin veya super_admin rolündeki kullanıcılar paket ekleyebilir
- İlk kurulumda seed script'i çalıştırmayı unutmayın





