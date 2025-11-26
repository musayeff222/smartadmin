# Kurulum Kılavuzu

Bu doküman, Restoran POS Uygulaması Tanıtım ve Yönetim Web Sitesi projesinin kurulum adımlarını içerir.

## Gereksinimler

- Node.js (v18 veya üzeri)
- PostgreSQL (v12 veya üzeri)
- npm veya yarn

## Backend Kurulumu

1. Backend klasörüne gidin:
```bash
cd backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyası oluşturun (`.env.example` dosyasını referans alarak):
```bash
cp .env.example .env
```

4. `.env` dosyasını düzenleyin ve veritabanı bilgilerinizi girin:
```
DATABASE_URL=postgresql://user:password@localhost:5432/pos_website
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=pos_website

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:3000
```

5. PostgreSQL veritabanını oluşturun:
```sql
CREATE DATABASE pos_website;
```

6. Veritabanını seed edin (ilk süper admin kullanıcısı ve örnek paketler):
```bash
npm run seed
```

7. Backend sunucusunu başlatın:
```bash
npm run dev
```

Backend sunucusu `http://localhost:5000` adresinde çalışacaktır.

## Frontend Kurulumu

1. Frontend klasörüne gidin:
```bash
cd frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. (Opsiyonel) `.env` dosyası oluşturun:
```
VITE_API_URL=http://localhost:5000/api
```

4. Frontend sunucusunu başlatın:
```bash
npm run dev
```

Frontend uygulaması `http://localhost:3000` adresinde çalışacaktır.

## İlk Giriş

Admin paneline giriş yapmak için:

- **Email:** admin@posrestaurant.com
- **Şifre:** admin123

⚠️ **Güvenlik Uyarısı:** İlk girişten sonra şifrenizi mutlaka değiştirin!

## Proje Yapısı

```
smartadmin/
├── backend/              # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── entities/    # Veritabanı modelleri
│   │   ├── routes/      # API route'ları
│   │   ├── middleware/  # Middleware'ler
│   │   └── scripts/     # Yardımcı script'ler
│   └── package.json
├── frontend/            # Frontend uygulaması (React + TypeScript)
│   ├── src/
│   │   ├── components/  # React bileşenleri
│   │   ├── pages/       # Sayfa bileşenleri
│   │   ├── services/    # API servisleri
│   │   └── contexts/    # React context'leri
│   └── package.json
└── README.md
```

## Özellikler

### Kullanıcı Tarafı
- ✅ Ana Sayfa - POS uygulaması tanıtımı
- ✅ Özellikler Sayfası - Detaylı özellik açıklamaları
- ✅ Abonelik Paketleri - Farklı planlar ve fiyatlandırma
- ✅ Hakkında/İletişim - SSS, iletişim formu

### Admin Paneli
- ✅ Kullanıcı ve abonelik yönetimi
- ✅ Paket içerik ve fiyat düzenleme
- ✅ İçerik yönetimi (metinler, görseller)
- ✅ İletişim formu yönetimi
- ✅ İstatistikler ve raporlar
- ✅ Süper admin yetkileri (kullanıcı yönetimi)

## Sorun Giderme

### Veritabanı Bağlantı Hatası
- PostgreSQL servisinin çalıştığından emin olun
- `.env` dosyasındaki veritabanı bilgilerini kontrol edin
- Veritabanının oluşturulduğundan emin olun

### Port Zaten Kullanımda
- Backend için farklı bir port kullanmak isterseniz `.env` dosyasındaki `PORT` değerini değiştirin
- Frontend için `vite.config.ts` dosyasındaki port ayarını değiştirin

### CORS Hatası
- Backend `.env` dosyasındaki `FRONTEND_URL` değerinin doğru olduğundan emin olun

## Üretim Ortamı

Üretim ortamına deploy etmeden önce:

1. `.env` dosyasındaki `JWT_SECRET` değerini güçlü bir değerle değiştirin
2. `NODE_ENV=production` olarak ayarlayın
3. Veritabanı bağlantı bilgilerini üretim ortamına göre güncelleyin
4. Frontend ve backend'i build edin:
   ```bash
   # Backend
   cd backend
   npm run build
   
   # Frontend
   cd frontend
   npm run build
   ```

## Destek

Sorularınız için iletişim sayfasını kullanabilir veya GitHub issues açabilirsiniz.

