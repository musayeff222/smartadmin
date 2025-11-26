#!/bin/bash

# DigitalOcean Deployment Script
# Bu script DigitalOcean droplet'inde çalıştırılmalıdır

set -e

echo "🚀 SmartAdmin Deployment Script Başlatılıyor..."

# Renkler
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Gerekli paketlerin kontrolü
echo -e "${YELLOW}📦 Gerekli paketler kontrol ediliyor...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker bulunamadı. Lütfen Docker kurun.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose bulunamadı. Lütfen Docker Compose kurun.${NC}"
    exit 1
fi

# .env dosyası kontrolü
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env dosyası bulunamadı. .env.example'dan kopyalanıyor...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Lütfen .env dosyasını düzenleyin ve tekrar çalıştırın.${NC}"
    exit 1
fi

# Docker Compose ile build ve start
echo -e "${GREEN}🔨 Docker image'ları build ediliyor...${NC}"
docker-compose build --no-cache

echo -e "${GREEN}🔄 Eski container'lar durduruluyor...${NC}"
docker-compose down

echo -e "${GREEN}🚀 Yeni container'lar başlatılıyor...${NC}"
docker-compose up -d

# Health check
echo -e "${YELLOW}⏳ Servislerin hazır olması bekleniyor (30 saniye)...${NC}"
sleep 30

# Backend health check
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend sağlıklı çalışıyor${NC}"
else
    echo -e "${RED}❌ Backend health check başarısız${NC}"
    docker-compose logs backend
    exit 1
fi

# Frontend health check
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend sağlıklı çalışıyor${NC}"
else
    echo -e "${RED}❌ Frontend health check başarısız${NC}"
    docker-compose logs frontend
    exit 1
fi

echo -e "${GREEN}🎉 Deployment başarıyla tamamlandı!${NC}"
echo -e "${GREEN}📊 Container durumu:${NC}"
docker-compose ps

echo -e "\n${YELLOW}💡 İpuçları:${NC}"
echo -e "  - Logları görmek için: docker-compose logs -f"
echo -e "  - Container'ları durdurmak için: docker-compose down"
echo -e "  - Yeniden başlatmak için: docker-compose restart"

