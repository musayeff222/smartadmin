# Restoran POS Uygulaması - Tanıtım ve Yönetim Web Sitesi

Modern, responsive bir web sitesi ve admin paneli ile restoran POS uygulamasını tanıtan ve yöneten platform.

## Proje Yapısı

```
smartadmin/
├── frontend/          # React + TypeScript + Tailwind CSS
├── backend/           # Node.js + Express + TypeScript
├── shared/            # Ortak tip tanımları
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
- ✅ Süper admin yetkileri

## Teknik Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT Authentication
- bcrypt

## Kurulum

Detaylı kurulum adımları için [KURULUM.md](./KURULUM.md) dosyasına bakın.

### Hızlı Başlangıç

1. **Backend Kurulumu:**
```bash
cd backend
npm install
# .env dosyasını oluşturun ve veritabanı bilgilerini girin
npm run seed  # İlk admin kullanıcısı ve örnek paketler
npm run dev
```

2. **Frontend Kurulumu:**
```bash
cd frontend
npm install
npm run dev
```

### İlk Giriş

- **Email:** admin@posrestaurant.com
- **Şifre:** admin123

⚠️ İlk girişten sonra şifrenizi mutlaka değiştirin!

## Lisans

MIT

