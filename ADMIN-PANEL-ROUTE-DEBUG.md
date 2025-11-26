# Admin Panel Route Debug Kılavuzu

## Sorun
`/admin-panel/packages` sayfası açılmıyor.

## Kontrol Edilmesi Gerekenler

### 1. Tarayıcı Konsolu (F12 → Console)
Şu mesajları kontrol edin:
- "AdminDashboard - User info: ..." görünüyor mu?
- "PackagesManagement component mounted" görünüyor mu?
- Herhangi bir hata mesajı var mı?

### 2. Network Sekmesi (F12 → Network)
- `/api/admin/packages` çağrısı yapılıyor mu?
- Response başarılı mı (200) yoksa hata mı (403, 404, 500)?

### 3. Sayfa Görünümü
- Sidebar görünüyor mu?
- Ana içerik alanı boş mu?
- Loading spinner görünüyor mu?

### 4. URL Kontrolü
- URL `/admin-panel/packages` olarak değişiyor mu?
- Sayfa yenilendiğinde URL korunuyor mu?

## Olası Sorunlar ve Çözümler

### Sorun 1: Route Eşleşmiyor
**Belirtiler:** Konsolda "Route Not Found" mesajı
**Çözüm:** Route path'leri relative olmalı (`packages` gibi, `/packages` değil)

### Sorun 2: API Çağrısı Başarısız
**Belirtiler:** Network sekmesinde 403 veya 401 hatası
**Çözüm:** 
- Token geçerli mi kontrol edin
- Backend çalışıyor mu kontrol edin
- Admin yetkisi var mı kontrol edin

### Sorun 3: Component Render Edilmiyor
**Belirtiler:** Konsolda "PackagesManagement component mounted" görünmüyor
**Çözüm:** Route yapılandırmasını kontrol edin

### Sorun 4: ProtectedRoute Redirect Ediyor
**Belirtiler:** Sayfa login'e yönlendiriliyor
**Çözüm:** 
- Kullanıcı bilgilerini kontrol edin
- Role kontrolünü kontrol edin

## Debug Komutları

Tarayıcı konsolunda şu komutları çalıştırın:

```javascript
// Mevcut path'i kontrol et
console.log('Current path:', window.location.pathname);

// LocalStorage'da kullanıcı bilgilerini kontrol et
console.log('User:', JSON.parse(localStorage.getItem('user') || 'null'));
console.log('Token:', localStorage.getItem('token'));

// Route match kontrolü
console.log('Route match:', window.location.pathname.match(/\/admin-panel\/packages/));
```

