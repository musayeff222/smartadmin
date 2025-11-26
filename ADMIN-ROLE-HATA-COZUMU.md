# 🔧 Admin Role Hatası Çözümü

## Sorun

Admin giriş yaparken şu hatayı alıyorsunuz:
```
Kullanıcı rolü tanımlı değil. Lütfen veritabanını kontrol edin.
```

Bu hata, veritabanındaki admin kullanıcısının `role` alanının boş veya null olmasından kaynaklanır.

## ✅ Çözüm Yöntemleri

### Yöntem 1: Node.js Script ile Otomatik Düzeltme (Önerilen)

Backend terminalinde şu komutu çalıştırın:

```bash
cd backend
npm run fix-admin
```

Bu script:
- Admin kullanıcısını bulur
- Role'u kontrol eder
- Eğer role boş veya geçersizse `super_admin` olarak ayarlar
- Kullanıcı yoksa yeni bir admin kullanıcısı oluşturur

### Yöntem 2: SQL Script ile Manuel Düzeltme

1. **phpMyAdmin'i açın:**
   - XAMPP Control Panel'de MySQL'in yanındaki **Admin** butonuna tıklayın

2. **Veritabanını seçin:**
   - Sol menüden `pos_website` veritabanını seçin

3. **SQL script'i çalıştırın:**
   - Üst menüden **SQL** sekmesine tıklayın
   - `backend/fix-admin-role-simple.sql` dosyasının içeriğini kopyalayıp yapıştırın
   - **Git** (Çalıştır) butonuna tıklayın

4. **Kontrol edin:**
   - Script çalıştıktan sonra sonuçları kontrol edin
   - Admin kullanıcısının `role` alanının `super_admin` olduğunu görmelisiniz

### Yöntem 3: Seed Script ile Düzeltme

Seed script'i artık mevcut admin kullanıcılarının role'unu otomatik olarak düzeltiyor:

```bash
cd backend
npm run seed
```

Bu komut:
- Admin kullanıcısını kontrol eder
- Role boşsa düzeltir
- Gerekirse yeni admin kullanıcısı oluşturur

## 🔍 Sorunun Nedeni

Bu sorun genellikle şu durumlarda oluşur:

1. **Veritabanı manuel oluşturulduğunda:** Role alanı varsayılan değerle oluşturulmamış olabilir
2. **Eski veriler:** Eski bir veritabanından veri aktarılırken role alanı kaybolmuş olabilir
3. **Migration sorunları:** TypeORM migration'ları düzgün çalışmamış olabilir

## ✅ Doğrulama

Sorunu çözdükten sonra:

1. **Backend'i başlatın:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend'den giriş yapmayı deneyin:**
   - Email: `admin@posrestaurant.com`
   - Şifre: `admin123`

3. **Başarılı giriş yapabilmelisiniz!**

## 📝 Notlar

- Admin kullanıcısının email'i: `admin@posrestaurant.com`
- Varsayılan şifre: `admin123`
- Role değerleri: `super_admin`, `admin`, `user`
- İlk girişten sonra şifrenizi değiştirmeyi unutmayın!

## 🆘 Hala Sorun mu Var?

Eğer hala sorun yaşıyorsanız:

1. **Veritabanı bağlantısını kontrol edin:**
   - `.env` dosyasındaki veritabanı bilgilerini kontrol edin
   - MySQL servisinin çalıştığından emin olun

2. **Konsol loglarını kontrol edin:**
   - Backend terminalinde hata mesajlarını kontrol edin
   - `npm run fix-admin` komutunu çalıştırıp çıktıyı kontrol edin

3. **Veritabanını manuel kontrol edin:**
   ```sql
   SELECT id, email, role, isActive 
   FROM users 
   WHERE email = 'admin@posrestaurant.com';
   ```

