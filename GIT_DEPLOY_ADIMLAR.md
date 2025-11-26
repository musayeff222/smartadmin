# 🚀 Git ile Sunucuya Yükleme ve Çalıştırma - Adım Adım

Bu rehber, GitHub'a yüklediğiniz projeyi DigitalOcean sunucusuna Git ile yükleyip çalıştırmanız için adım adım talimatlar içerir.

## ✅ Ön Gereksinimler

- ✅ Proje GitHub'a yüklenmiş olmalı: `https://github.com/musayeff222/smartadmin.git`
- ✅ DigitalOcean droplet oluşturulmuş olmalı
- ✅ Docker kurulu olmalı (rehberdeki adımları takip edin)

---

## 📋 Adım Adım Talimatlar

### 1️⃣ Sunucuya SSH ile Bağlanın

**Windows PowerShell veya CMD'de:**
```powershell
ssh root@YOUR_DROPLET_IP
```

**İlk bağlantıda:**
- "Are you sure you want to continue connecting?" → `yes` yazın
- Şifre istenirse → DigitalOcean'dan aldığınız şifreyi girin

---

### 2️⃣ Git Kurulumunu Kontrol Edin

```bash
git --version
```

**Eğer Git yüklü değilse:**
```bash
apt update
apt install -y git
```

---

### 3️⃣ Projeyi GitHub'dan Clone Edin

```bash
# Proje klasörüne git
cd /opt

# Repository'nizi clone edin
git clone https://github.com/musayeff222/smartadmin.git smartadmin

# Proje klasörüne gir
cd smartadmin
```

**Başarılı olursa şunu göreceksiniz:**
```
Cloning into 'smartadmin'...
remote: Enumerating objects: XX, done.
remote: Counting objects: 100% (XX/XX), done.
remote: Compressing objects: 100% (XX/XX), done.
Receiving objects: 100% (XX/XX), done.
```

---

### 4️⃣ Dosyaların Yüklendiğini Kontrol Edin

```bash
# Dosyaları listeleyin
ls -la

# Şunlar görünmeli:
# - backend/
# - frontend/
# - docker-compose.yml
# - deploy.sh
# - env.example
# - DIGITALOCEAN_DEPLOY.md
# vb.
```

---

### 5️⃣ Environment Dosyası Oluşturun

```bash
# env.example'dan .env dosyası oluştur
cp env.example .env

# .env dosyasını düzenle
nano .env
```

**.env dosyasında şunları değiştirin:**

```env
# Database Configuration
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=pos_user
DB_PASSWORD=GÜÇLÜ_ŞİFRE_BURAYA
DB_NAME=pos_website
DB_ROOT_PASSWORD=GÜÇLÜ_ROOT_ŞİFRE_BURAYA

# Server Configuration
NODE_ENV=production
PORT=5000

# JWT Secret (ÖNEMLİ: Güçlü bir secret kullanın!)
JWT_SECRET=GÜÇLÜ_SECRET_KEY_BURAYA_EN_AZ_32_KARAKTER

# Frontend URL
FRONTEND_URL=http://YOUR_DROPLET_IP
```

**Güçlü şifre oluşturmak için:**
```bash
# Terminal'de şunu çalıştırın (32 karakter şifre oluşturur)
openssl rand -base64 32
```

**Nano editörde:**
- Dosyayı düzenleyin
- `Ctrl + O` → Enter (kaydet)
- `Ctrl + X` (çıkış)

---

### 6️⃣ Deployment Script'ini Hazırlayın

```bash
# Script'i çalıştırılabilir yap
chmod +x deploy.sh

# İzinleri kontrol et (opsiyonel)
ls -l deploy.sh
# Şunu görmelisiniz: -rwxr-xr-x (x harfleri çalıştırılabilir olduğunu gösterir)
```

**Eğer hala "Permission denied" hatası alırsanız:**
```bash
# Dosya izinlerini kontrol et
ls -l deploy.sh

# Eğer izinler yoksa, şunu deneyin:
chmod 755 deploy.sh

# Veya alternatif olarak bash ile çalıştırın:
bash deploy.sh
```

---

### 7️⃣ Projeyi Deploy Edin

```bash
# Yöntem 1: Doğrudan çalıştır (önerilen)
./deploy.sh

# Yöntem 2: Eğer yukarıdaki çalışmazsa, bash ile çalıştır
bash deploy.sh

# Yöntem 3: sh ile çalıştır
sh deploy.sh
```

**Bu script şunları yapar:**
- ✅ Docker image'larını build eder
- ✅ Eski container'ları durdurur
- ✅ Yeni container'ları başlatır
- ✅ Health check yapar

**İlk deployment 5-10 dakika sürebilir** (image'lar indiriliyor ve build ediliyor).

**Veya manuel olarak:**
```bash
docker compose build
docker compose up -d
docker compose logs -f
```

---

### 8️⃣ Servislerin Çalıştığını Kontrol Edin

```bash
# Container durumunu kontrol et
docker compose ps
```

**Tüm servisler "Up" durumunda olmalı:**
- `smartadmin-mysql` - Veritabanı
- `smartadmin-backend` - Backend API
- `smartadmin-frontend` - Frontend

**Eğer bir servis "Exited" durumundaysa:**
```bash
# Logları kontrol et
docker compose logs smartadmin-backend
docker compose logs smartadmin-frontend
docker compose logs mysql
```

---

### 9️⃣ Health Check Yapın

```bash
# Backend health check
curl http://localhost:5000/api/health

# Başarılı olursa:
# {"status":"ok","message":"Server is running"}

# Frontend health check
curl http://localhost/health

# Başarılı olursa:
# healthy
```

---

### 🔟 Tarayıcıda Test Edin

**Windows tarayıcınızda:**
- **Frontend:** `http://YOUR_DROPLET_IP`
- **Backend API:** `http://YOUR_DROPLET_IP:5000/api/health`

**Başarılı olursa:**
- Frontend sayfası açılmalı
- Backend API health check çalışmalı

---

## 🔄 Güncelleme Yapmak İçin

Kod değişikliği yaptıktan sonra:

### Windows'ta:
```powershell
cd C:\Users\User\Desktop\smartadmin
git add .
git commit -m "Update description"
git push
```

### Sunucuda:
```bash
cd /opt/smartadmin

# Eğer yerel değişiklikler varsa (hata alırsanız):
# Seçenek 1: Yerel değişiklikleri stash et (geçici olarak sakla)
git stash
git pull
git stash pop  # Eğer stash'teki değişiklikleri geri istiyorsanız

# Seçenek 2: Yerel değişiklikleri at ve GitHub'daki versiyonu kullan (önerilen)
git reset --hard HEAD
git pull

# Sonra deploy et
./deploy.sh
```

**Not:** Eğer `git pull` sırasında "Your local changes would be overwritten" hatası alırsanız:
```bash
# Yerel değişiklikleri at ve GitHub'daki versiyonu kullan
git reset --hard HEAD
git pull
```

---

## 🐛 Sorun Giderme

### Container'lar başlamıyor
```bash
# Tüm logları görüntüle
docker compose logs

# Belirli bir servisin loglarını görüntüle
docker compose logs backend
docker compose logs frontend
docker compose logs mysql
```

### Port çakışması
```bash
# Port kullanımını kontrol et
netstat -tulpn | grep :80
netstat -tulpn | grep :5000

# Gerekirse docker-compose.yml'de portları değiştirin
```

### Veritabanı bağlantı hatası
```bash
# MySQL loglarını kontrol et
docker compose logs mysql

# MySQL container'ına bağlan
docker exec -it smartadmin-mysql mysql -u root -p
# Şifre: .env dosyasındaki DB_ROOT_PASSWORD
```

### Git clone hatası
```bash
# Repository public mi kontrol et
# Private repository ise GitHub kullanıcı adı ve şifre/token gerekir

# Veya SSH key kullanın:
git clone git@github.com:musayeff222/smartadmin.git smartadmin
```

---

## ✅ Başarı Kontrol Listesi

- [ ] Sunucuya SSH ile bağlanıldı
- [ ] Git kurulu ve çalışıyor
- [ ] Proje GitHub'dan clone edildi
- [ ] .env dosyası oluşturuldu ve düzenlendi
- [ ] deploy.sh çalıştırılabilir yapıldı
- [ ] Deployment başarıyla tamamlandı
- [ ] Tüm container'lar "Up" durumunda
- [ ] Health check'ler başarılı
- [ ] Tarayıcıda frontend açılıyor
- [ ] Backend API çalışıyor

---

## 📚 Daha Fazla Bilgi

- Detaylı rehber: `DIGITALOCEAN_DEPLOY.md`
- Hızlı başlangıç: `deploy-quick-start.md`

**Başarılar! 🚀**

