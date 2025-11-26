# 🚀 DigitalOcean Hızlı Başlangıç Rehberi

Bu rehber, projenizi DigitalOcean'a hızlıca deploy etmek için özet adımları içerir.

## ⚡ Hızlı Adımlar

### 1. DigitalOcean Droplet Oluştur
- Ubuntu 22.04 LTS
- En az 2GB RAM (4GB önerilir)
- SSH key veya password ile authentication

### 2. Sunucuya Bağlan
```bash
ssh root@YOUR_DROPLET_IP
```

### 3. Docker Kurulumu
```bash
apt update && apt upgrade -y
apt install -y ca-certificates curl gnupg lsb-release

# Modern GPG key ekleme yöntemi (şifre istemez)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Repository ekleme (onay istemez)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl start docker
systemctl enable docker
```

### 4. Firewall Ayarları
```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 5. Projeyi Yükle

**Seçenek A: Git ile (önerilen)**
```bash
cd /opt
git clone https://github.com/musayeff222/smartadmin.git smartadmin
cd smartadmin
```

**Not:** Repository public ise sorunsuz clone edilir. Private ise GitHub kullanıcı adı ve şifre/token isteyebilir.

**Seçenek B: Manuel yükleme (Git gerekmez)**
- Windows'ta WinSCP veya PowerShell SCP ile dosyaları yükleyin
- Detaylar için `DIGITALOCEAN_DEPLOY.md` dosyasına bakın

### 6. Environment Dosyası Oluştur
```bash
cp env.example .env
nano .env
```

**Önemli:** `.env` dosyasında şunları güncelleyin:
- `DB_PASSWORD`: Güçlü bir şifre
- `DB_ROOT_PASSWORD`: Güçlü bir şifre
- `JWT_SECRET`: En az 32 karakterlik güçlü bir secret (openssl rand -base64 32 ile oluşturabilirsiniz)
- `FRONTEND_URL`: Domain'iniz varsa `https://yourdomain.com`, yoksa `http://YOUR_DROPLET_IP`

### 7. Deploy Et
```bash
chmod +x deploy.sh
./deploy.sh
```

### 8. Kontrol Et
```bash
# Container durumu
docker-compose ps

# Loglar
docker-compose logs -f

# Health check
curl http://localhost:5000/api/health
curl http://localhost/health
```

## ✅ Başarılı!

Artık uygulamanız çalışıyor olmalı:
- Frontend: `http://YOUR_DROPLET_IP`
- Backend API: `http://YOUR_DROPLET_IP:5000/api`

## 📚 Detaylı Rehber

Daha detaylı bilgi için `DIGITALOCEAN_DEPLOY.md` dosyasına bakın.

## 🔧 Yaygın Sorunlar

### Container'lar başlamıyor
```bash
docker-compose logs
```

### Port çakışması
```bash
netstat -tulpn | grep :80
netstat -tulpn | grep :5000
```

### Veritabanı bağlantı hatası
```bash
docker-compose logs mysql
docker exec -it smartadmin-mysql mysql -u root -p
```

