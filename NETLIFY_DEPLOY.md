# Netlify Deployment Rehberi

Bu proje Netlify'da deploy edilmek için hazırlanmıştır.

## 📋 Ön Gereksinimler

1. **Netlify Hesabı**: [netlify.com](https://netlify.com) üzerinden ücretsiz hesap oluşturun
2. **GitHub Repository**: Projenizi GitHub'a yükleyin
3. **Backend Hosting**: Backend'i ayrı bir serviste deploy edin (Railway, Render, Heroku, vb.)

## 🚀 Deployment Adımları

### 1. Backend'i Deploy Edin

Backend'i ayrı bir serviste deploy etmeniz gerekiyor. Önerilen servisler:

#### Railway (Önerilen)
1. [railway.app](https://railway.app) üzerinden hesap oluşturun
2. "New Project" → "Deploy from GitHub repo"
3. Backend klasörünü seçin
4. Environment variables ekleyin:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `DB_DATABASE`
   - `JWT_SECRET`
   - `PORT=5000`

#### Render
1. [render.com](https://render.com) üzerinden hesap oluşturun
2. "New Web Service" → GitHub repo seçin
3. Backend klasörünü seçin
4. Build command: `cd backend && npm install && npm run build`
5. Start command: `cd backend && npm start`

### 2. Frontend'i Netlify'da Deploy Edin

#### Yöntem 1: Netlify Dashboard (Önerilen)

1. [Netlify Dashboard](https://app.netlify.com) → "Add new site" → "Import an existing project"
2. GitHub repository'nizi seçin
3. Build ayarları:
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend/dist`
4. Environment variables ekleyin:
   - `VITE_API_URL`: Backend URL'iniz (örn: `https://your-backend.railway.app/api`)
   - `VITE_WHATSAPP_NUMBER`: WhatsApp numaranız (opsiyonel)
5. "Deploy site" butonuna tıklayın

#### Yöntem 2: Netlify CLI

```bash
# Netlify CLI'yi yükleyin
npm install -g netlify-cli

# Netlify'da giriş yapın
netlify login

# Proje dizinine gidin
cd frontend

# Site oluşturun ve deploy edin
netlify init
netlify deploy --prod
```

### 3. Environment Variables Ayarlayın

Netlify Dashboard → Site settings → Environment variables:

```
VITE_API_URL=https://your-backend-url.com/api
VITE_WHATSAPP_NUMBER=994501234567
```

### 4. Custom Domain (Opsiyonel)

1. Netlify Dashboard → Domain settings
2. "Add custom domain" → Domain'inizi ekleyin
3. DNS ayarlarını domain sağlayıcınızda yapın

## 🔧 Build Ayarları

Netlify otomatik olarak `netlify.toml` dosyasını kullanır. Manuel ayar yapmak isterseniz:

- **Base directory**: `frontend`
- **Build command**: `npm install && npm run build`
- **Publish directory**: `frontend/dist`

## 📝 Önemli Notlar

1. **Backend URL**: Frontend'in backend'e erişebilmesi için CORS ayarlarını backend'de yapın:
   ```typescript
   // backend/src/server.ts
   app.use(cors({
     origin: ['https://your-netlify-site.netlify.app', 'http://localhost:3000'],
     credentials: true
   }));
   ```

2. **Database**: Production database kullanın (MySQL, PostgreSQL, vb.)

3. **Environment Variables**: Tüm hassas bilgileri environment variables olarak saklayın

4. **HTTPS**: Netlify otomatik olarak HTTPS sağlar

## 🐛 Sorun Giderme

### Build Hatası
- Node.js versiyonunu kontrol edin (Netlify varsayılan olarak 18 kullanır)
- `package.json` dosyasında build script'lerini kontrol edin

### API Bağlantı Hatası
- Backend URL'inin doğru olduğundan emin olun
- CORS ayarlarını kontrol edin
- Backend'in çalıştığından emin olun

### 404 Hatası (SPA Routing)
- `_redirects` dosyasının `frontend/public/` klasöründe olduğundan emin olun
- `netlify.toml` dosyasındaki redirect kurallarını kontrol edin

## 📚 Ek Kaynaklar

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#netlify)
- [Railway Documentation](https://docs.railway.app/)

