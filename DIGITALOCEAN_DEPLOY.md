# DigitalOcean'a Deployment Rehberi

Bu rehber, SmartAdmin uygulamanızı DigitalOcean'a deploy etmek için adım adım talimatlar içerir.

## 📋 İçindekiler

1. [Gereksinimler](#gereksinimler)
2. [DigitalOcean Droplet Oluşturma](#digitalocean-droplet-oluşturma)
3. [Sunucu Kurulumu](#sunucu-kurulumu)
4. [Projeyi Sunucuya Yükleme](#projeyi-sunucuya-yükleme)
5. [Environment Variables Ayarlama](#environment-variables-ayarlama)
6. [Deployment](#deployment)
7. [Domain ve SSL Ayarları](#domain-ve-ssl-ayarları)
8. [Sorun Giderme](#sorun-giderme)

---

## 🎯 Gereksinimler

- DigitalOcean hesabı
- Domain adı (opsiyonel ama önerilir)
- Git repository (GitHub, GitLab, vb.)

---

## 💻 DigitalOcean Droplet Oluşturma

### 1. DigitalOcean'a Giriş Yapın

[DigitalOcean](https://www.digitalocean.com) hesabınıza giriş yapın.

### 2. Yeni Droplet Oluşturun

1. **"Create"** butonuna tıklayın ve **"Droplets"** seçin
2. **Image:** Ubuntu 22.04 (LTS) x64 seçin
3. **Plan:** En az 2GB RAM / 1 vCPU önerilir (4GB RAM daha iyi performans için)
4. **Datacenter region:** Size en yakın bölgeyi seçin
5. **Authentication:** SSH keys ekleyin (güvenlik için önerilir) veya root password kullanın
6. **Droplet name:** `smartadmin-server` gibi bir isim verin
7. **"Create Droplet"** butonuna tıklayın

### 3. Droplet IP Adresini Not Edin

Droplet oluşturulduktan sonra size bir IP adresi verilecek. Bu IP'yi not edin.

---

## 🛠️ Sunucu Kurulumu

### 1. Sunucuya SSH ile Bağlanın

```bash
ssh root@YOUR_DROPLET_IP
```

Veya SSH key kullanıyorsanız:
```bash
ssh -i /path/to/your/key root@YOUR_DROPLET_IP
```

### 2. Sistem Güncellemesi

```bash
apt update && apt upgrade -y
```

### 3. Docker Kurulumu

```bash
# Docker kurulumu için gerekli paketleri yükle
apt update
apt install -y ca-certificates curl gnupg lsb-release

# Docker'ın resmi GPG key'ini ekle (modern yöntem - şifre istemez)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Docker repository'yi ekle (non-interactive - şifre istemez)
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker'ı yükle
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Docker servisini başlat
systemctl start docker
systemctl enable docker

# Docker kurulumunu doğrula
docker --version
docker compose version
```

**Not:** Bu komutlar şifre istemez. Eğer şifre istenirse, muhtemelen `sudo` kullanmanız gerekiyordur. Root kullanıcısıysanız `sudo` gerekmez.

### 4. Firewall Ayarları

```bash
# UFW firewall kurulumu
apt install -y ufw

# Gerekli portları aç
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 5000/tcp  # Backend API (opsiyonel, sadece test için)

# Firewall'u etkinleştir
ufw enable
ufw status
```

### 5. Git Kurulumu (Eğer yoksa)

```bash
apt install -y git
```

---

## 📦 Projeyi Sunucuya Yükleme

İki yöntem var: **Git kullanarak** (güncellemeler kolay) veya **Manuel yükleme** (Git bilgisi gerekmez).

---

### 🔀 Yöntem 1: Git ile Yükleme (Önerilen - Güncellemeler Kolay)

**Git kullanmak istiyorsanız:**

#### 1.1. GitHub'a Projeyi Yükleyin

**Windows'ta PowerShell veya CMD kullanarak:**

**Adım 1: Git'in kurulu olduğunu kontrol edin**
```powershell
# PowerShell veya CMD'de çalıştırın
git --version
```
Eğer Git yüklü değilse: [Git'i indirin](https://git-scm.com/download/win) ve kurun.

**Adım 2: Proje klasörünüze gidin**
```powershell
# PowerShell veya CMD'de çalıştırın
cd C:\Users\User\Desktop\smartadmin
```

**Adım 3: Git repository başlatın**
```powershell
git init
```
Bu komut `.git` klasörü oluşturur (gizli klasör).

**Adım 4: Tüm dosyaları Git'e ekleyin**
```powershell
git add .
```
Bu komut tüm dosyaları staging area'ya ekler.

**Adım 5: İlk commit yapın**
```powershell
git commit -m "Initial commit - SmartAdmin project"
```
Bu komut dosyaları yerel Git repository'nize kaydeder.

**Adım 6: GitHub repository'nizi bağlayın**
```powershell
# Sizin repository URL'iniz:
git remote add origin https://github.com/musayeff222/smartadmin.git
```

**Adım 7: Branch'i main olarak ayarlayın**
```powershell
git branch -M main
```

**Adım 8: Dosyaları GitHub'a yükleyin**
```powershell
git push -u origin main
```

**Önemli:** Bu adımda GitHub kullanıcı adı ve şifre (veya Personal Access Token) isteyebilir:
- **Kullanıcı adı:** `musayeff222`
- **Şifre:** GitHub şifreniz VEYA Personal Access Token (önerilir)

**Personal Access Token oluşturma (önerilir):**
1. GitHub'da sağ üstte profil fotoğrafınıza tıklayın → **Settings**
2. Sol menüden **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)** butonuna tıklayın
4. Token'a bir isim verin (örn: `smartadmin-deploy`)
5. **repo** seçeneğini işaretleyin (tüm repo izinleri)
6. **Generate token** butonuna tıklayın
7. Token'ı kopyalayın (bir daha gösterilmeyecek!)
8. `git push` komutunda şifre yerine bu token'ı kullanın

**Tüm komutlar bir arada (kopyala-yapıştır için):**
```powershell
cd C:\Users\User\Desktop\smartadmin
git init
git add .
git commit -m "Initial commit - SmartAdmin project"
git remote add origin https://github.com/musayeff222/smartadmin.git
git branch -M main
git push -u origin main
```

**Başarılı olursa şunu göreceksiniz:**
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), done.
To https://github.com/musayeff222/smartadmin.git
 * [new branch]      main -> main
```

**Hata alırsanız:**
- `remote origin already exists` hatası → `git remote remove origin` çalıştırın, sonra tekrar `git remote add origin ...`
- Authentication hatası → Personal Access Token kullanın
- `fatal: not a git repository` → `git init` komutunu çalıştırın

#### 1.2. Sunucuya Git ile Clone Edin ve Çalıştırın

**Adım 1: Sunucuya SSH ile Bağlanın**
```bash
# Windows PowerShell veya CMD'de:
ssh root@YOUR_DROPLET_IP

# İlk bağlantıda "Are you sure you want to continue connecting?" sorusuna "yes" yazın
# Şifre istenirse, DigitalOcean'dan aldığınız şifreyi girin
```

**Adım 2: Git'in Kurulu Olduğunu Kontrol Edin**
```bash
git --version
```
Eğer Git yüklü değilse:
```bash
apt update
apt install -y git
```

**Adım 3: Projeyi GitHub'dan Clone Edin**
```bash
# Proje klasörüne git
cd /opt

# Repository'nizi clone edin (SİZİN REPO URL'İNİZ)
git clone https://github.com/musayeff222/smartadmin.git smartadmin

# Proje klasörüne gir
cd smartadmin
```

**Not:** Eğer repository private ise, GitHub kullanıcı adı ve şifre/token isteyebilir. Public repository ise sorunsuz clone edilir.

**Adım 4: Dosyaların Yüklendiğini Kontrol Edin**
```bash
# Dosyaları listeleyin
ls -la

# Şunlar görünmeli:
# - backend/
# - frontend/
# - docker-compose.yml
# - deploy.sh
# - env.example
# vb.
```

**Adım 5: Environment Dosyası Oluşturun**
```bash
# env.example'dan .env dosyası oluştur
cp env.example .env

# .env dosyasını düzenle
nano .env
```

**.env dosyasında şunları değiştirin:**
```env
# Database Configuration
DB_HOST=mysql                    # Docker Compose için "mysql" kullanın
DB_PORT=3306
DB_USERNAME=pos_user            # İstediğiniz kullanıcı adı
DB_PASSWORD=güçlü-şifre-buraya  # Güçlü bir şifre oluşturun
DB_NAME=pos_website
DB_ROOT_PASSWORD=güçlü-root-şifre  # Güçlü bir şifre oluşturun

# Server Configuration
NODE_ENV=production
PORT=5000

# JWT Secret (ÖNEMLİ: Güçlü bir secret kullanın!)
JWT_SECRET=çok-güçlü-ve-uzun-bir-secret-key-buraya-en-az-32-karakter

# Frontend URL
FRONTEND_URL=http://YOUR_DROPLET_IP
# Veya domain'iniz varsa:
# FRONTEND_URL=https://yourdomain.com
```

**Güçlü şifre oluşturmak için:**
```bash
# Şifre oluştur (32 karakter)
openssl rand -base64 32
```

**Dosyayı kaydetmek için:**
- `Ctrl + O` → Enter (kaydet)
- `Ctrl + X` (çıkış)

**Adım 6: Deployment Script'ini Çalıştırılabilir Yapın**
```bash
chmod +x deploy.sh
```

**Adım 7: Projeyi Deploy Edin**
```bash
# Deployment script'ini çalıştır
./deploy.sh
```

Bu script:
- ✅ Docker image'larını build eder
- ✅ Eski container'ları durdurur
- ✅ Yeni container'ları başlatır
- ✅ Health check yapar

**Veya manuel olarak:**
```bash
# Docker image'ları build et
docker compose build

# Container'ları başlat
docker compose up -d

# Logları kontrol et
docker compose logs -f
```

**Adım 8: Servislerin Çalıştığını Kontrol Edin**
```bash
# Container durumunu kontrol et
docker compose ps

# Tüm servisler "Up" durumunda olmalı:
# - smartadmin-mysql
# - smartadmin-backend
# - smartadmin-frontend
```

**Adım 9: Health Check Yapın**
```bash
# Backend health check
curl http://localhost:5000/api/health

# Frontend health check
curl http://localhost/health

# Başarılı olursa şunu göreceksiniz:
# {"status":"ok","message":"Server is running"}
```

**Adım 10: Tarayıcıda Test Edin**
- Frontend: `http://YOUR_DROPLET_IP`
- Backend API: `http://YOUR_DROPLET_IP:5000/api/health`

---

### 🔄 Güncelleme Yapmak İçin

Kod değişikliği yaptıktan sonra:

**Windows'ta:**
```powershell
cd C:\Users\User\Desktop\smartadmin
git add .
git commit -m "Update description"
git push
```

**Sunucuda:**
```bash
cd /opt/smartadmin
git pull
./deploy.sh
```

**Avantajları:**
- ✅ Güncellemeler kolay: `git pull` ile güncelleyebilirsiniz
- ✅ Versiyon kontrolü
- ✅ Kolay yedekleme
- ✅ Hızlı deployment

---

### 📁 Yöntem 2: Manuel Yükleme (Git Gerekmez - Kolay Yöntem)

**Git kullanmak istemiyorsanız, dosyaları doğrudan yükleyin:**

#### 2.1. Windows'ta SCP ile Yükleme (Önerilen)

**WinSCP veya PowerShell kullanarak:**

**PowerShell ile (Windows 10/11):**

```powershell
# PowerShell'de şu komutu çalıştırın
# (Proje klasörünüzde olun)
cd C:\Users\User\Desktop\smartadmin

# Tüm dosyaları sunucuya yükleyin
scp -r * root@YOUR_DROPLET_IP:/opt/smartadmin/
```

**Veya WinSCP kullanarak:**
1. [WinSCP](https://winscp.net) programını indirin ve kurun
2. Yeni bağlantı oluşturun:
   - **Host name:** `YOUR_DROPLET_IP`
   - **User name:** `root`
   - **Password:** Droplet şifreniz
   - **Port:** `22`
3. Bağlanın
4. Sol tarafta Windows klasörünüzü, sağ tarafta `/opt/smartadmin` klasörünü açın
5. Tüm dosyaları sürükle-bırak ile yükleyin

#### 2.2. Sunucuda Klasör Oluşturun

```bash
# Sunucuda klasör oluştur
mkdir -p /opt/smartadmin
cd /opt/smartadmin
```

Sonra Windows'tan dosyaları yükleyin (yukarıdaki SCP yöntemi ile).

#### 2.3. ZIP ile Yükleme (Alternatif)

**Windows'ta:**
1. Proje klasörünüze gidin: `C:\Users\User\Desktop\smartadmin`
2. Tüm dosyaları seçin ve ZIP'e sıkıştırın
3. ZIP dosyasını sunucuya yükleyin (WinSCP veya SCP ile)

**Sunucuda:**
```bash
cd /opt
# ZIP dosyasını buraya yükleyin, sonra:
unzip smartadmin.zip -d smartadmin
cd smartadmin
```

**Not:** `node_modules` klasörünü yüklemeyin! Sunucuda `npm install` çalıştırılacak.

---

### ⚠️ Önemli Notlar

- **`node_modules` klasörünü yüklemeyin** - Sunucuda `npm install` çalıştırılacak
- **`.env` dosyasını yüklemeyin** - Sunucuda oluşturulacak
- **`whatsapp-session` klasörünü yüklemeyin** - Boş olarak oluşturulacak

**Hangi yöntemi seçmeliyim?**
- Git kullanmayı biliyorsanız → **Yöntem 1** (daha kolay güncelleme)
- Git bilmiyorsanız → **Yöntem 2** (daha basit, WinSCP kullanın)

### 3. Deployment Script'ini Çalıştırılabilir Yapın

```bash
# Script'i çalıştırılabilir yap
chmod +x deploy.sh
```

**Manuel yükleme yaptıysanız, dosyaların tamamının yüklendiğinden emin olun:**
```bash
# Dosyaları kontrol et
ls -la
# Şunlar görünmeli: backend/, frontend/, docker-compose.yml, deploy.sh, vb.
```

---

## ⚙️ Environment Variables Ayarlama

### 1. .env Dosyası Oluşturun

```bash
cd /opt/smartadmin
cp .env.example .env
nano .env
```

### 2. .env Dosyasını Düzenleyin

Aşağıdaki değerleri kendi bilgilerinize göre güncelleyin:

```env
# Database Configuration
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=pos_user
DB_PASSWORD=güçlü-bir-şifre-buraya
DB_NAME=pos_website
DB_ROOT_PASSWORD=güçlü-root-şifre-buraya

# Server Configuration
NODE_ENV=production
PORT=5000

# JWT Secret (ÖNEMLİ: Güçlü bir secret kullanın!)
JWT_SECRET=çok-güçlü-ve-uzun-bir-secret-key-buraya-en-az-32-karakter

# Frontend URL (Domain'iniz varsa)
FRONTEND_URL=https://yourdomain.com
# Veya IP ile
FRONTEND_URL=http://YOUR_DROPLET_IP

# VAPID Keys (Push notifications için - opsiyonel)
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=
```

**Güçlü şifre oluşturmak için:**
```bash
openssl rand -base64 32
```

---

## 🚀 Deployment

### 1. İlk Deployment

```bash
cd /opt/smartadmin
./deploy.sh
```

Veya manuel olarak:

```bash
# Docker image'ları build et
docker-compose build

# Container'ları başlat
docker-compose up -d

# Logları kontrol et
docker-compose logs -f
```

### 2. Veritabanı Migration (İlk kurulumda)

```bash
# Backend container'ına gir
docker exec -it smartadmin-backend sh

# Veritabanı seed script'ini çalıştır (eğer gerekirse)
npm run seed
```

### 3. Servis Durumunu Kontrol Edin

```bash
# Tüm container'ların durumunu görüntüle
docker-compose ps

# Logları görüntüle
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Health check
curl http://localhost:5000/api/health
curl http://localhost/health
```

---

## 🌐 Domain ve SSL Ayarları

### 1. Domain DNS Ayarları

DigitalOcean DNS panelinden veya domain sağlayıcınızdan:

- **A Record:** `@` → `YOUR_DROPLET_IP`
- **A Record:** `www` → `YOUR_DROPLET_IP`

### 2. Nginx Reverse Proxy Kurulumu (Domain için)

Eğer domain kullanacaksanız, Nginx'i reverse proxy olarak kurabilirsiniz:

```bash
apt install -y nginx certbot python3-certbot-nginx
```

### 3. Nginx Configuration

`/etc/nginx/sites-available/smartadmin` dosyası oluşturun:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Symlink oluştur
ln -s /etc/nginx/sites-available/smartadmin /etc/nginx/sites-enabled/

# Nginx'i test et
nginx -t

# Nginx'i yeniden başlat
systemctl restart nginx
```

### 4. SSL Sertifikası (Let's Encrypt)

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

SSL sertifikası otomatik olarak yenilenecek şekilde ayarlanır.

---

## 🔄 Güncelleme ve Yeniden Deploy

### Kod Güncellemesi Sonrası

```bash
cd /opt/smartadmin

# Git'ten son değişiklikleri çek
git pull

# Yeniden deploy et
./deploy.sh
```

Veya manuel:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 🐛 Sorun Giderme

### Container'lar Çalışmıyor

```bash
# Container durumunu kontrol et
docker-compose ps

# Logları incele
docker-compose logs

# Belirli bir servisin loglarını görüntüle
docker-compose logs backend
```

### Veritabanı Bağlantı Sorunu

```bash
# MySQL container'ına bağlan
docker exec -it smartadmin-mysql mysql -u root -p

# Veritabanını kontrol et
SHOW DATABASES;
USE pos_website;
SHOW TABLES;
```

### Port Çakışması

```bash
# Port kullanımını kontrol et
netstat -tulpn | grep :80
netstat -tulpn | grep :5000

# Gerekirse docker-compose.yml'de portları değiştirin
```

### Disk Alanı Sorunu

```bash
# Disk kullanımını kontrol et
df -h

# Kullanılmayan Docker image'ları temizle
docker system prune -a

# Volume'ları kontrol et
docker volume ls
```

### Backend Logları

```bash
# Real-time log takibi
docker-compose logs -f backend

# Son 100 satır
docker-compose logs --tail=100 backend
```

---

## 📊 Monitoring ve Maintenance

### PM2 ile Process Management (Opsiyonel)

Eğer Docker yerine PM2 kullanmak isterseniz:

```bash
# PM2 kurulumu
npm install -g pm2

# Backend'i PM2 ile başlat
cd /opt/smartadmin/backend
npm install
npm run build
pm2 start ecosystem.config.js

# PM2'yi sistem başlangıcında otomatik başlat
pm2 startup
pm2 save
```

### Otomatik Backup (Önerilir)

MySQL veritabanı için otomatik backup script'i oluşturun:

```bash
# Backup script oluştur
nano /opt/smartadmin/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker exec smartadmin-mysql mysqldump -u root -p$DB_ROOT_PASSWORD pos_website > $BACKUP_DIR/backup_$DATE.sql

# Eski backup'ları sil (7 günden eski)
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

```bash
chmod +x /opt/smartadmin/backup.sh

# Crontab'a ekle (her gün saat 02:00'de)
crontab -e
# Şunu ekle:
0 2 * * * /opt/smartadmin/backup.sh
```

---

## ✅ Deployment Kontrol Listesi

- [ ] DigitalOcean droplet oluşturuldu
- [ ] SSH ile bağlanıldı
- [ ] Docker ve Docker Compose kuruldu
- [ ] Firewall ayarları yapıldı
- [ ] Proje sunucuya yüklendi
- [ ] .env dosyası oluşturuldu ve düzenlendi
- [ ] İlk deployment yapıldı
- [ ] Health check'ler başarılı
- [ ] Domain DNS ayarları yapıldı (opsiyonel)
- [ ] SSL sertifikası kuruldu (opsiyonel)
- [ ] Backup sistemi kuruldu (önerilir)

---

## 🆘 Yardım ve Destek

Sorun yaşarsanız:

1. Logları kontrol edin: `docker-compose logs`
2. Container durumunu kontrol edin: `docker-compose ps`
3. Health check yapın: `curl http://localhost:5000/api/health`
4. DigitalOcean dokümantasyonuna bakın: https://docs.digitalocean.com

---

## 📝 Notlar

- Production ortamında `synchronize: false` yapın (`backend/src/data-source.ts`)
- Güçlü şifreler kullanın
- Düzenli backup alın
- SSL sertifikası kullanın
- Firewall kurallarını düzenli kontrol edin
- Logları düzenli takip edin

**Başarılar! 🚀**

