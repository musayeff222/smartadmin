#!/bin/bash
# Lokal MySQL Backup'ını Docker MySQL Container'ına Import Etme Scripti

set -e

echo "========================================"
echo "MySQL Veritabani Import Scripti"
echo "========================================"
echo ""

# Backup dosyasını kontrol et
BACKUP_FILE="pos_website_backup.sql"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "HATA: $BACKUP_FILE dosyasi bulunamadi!"
    echo "Lutfen backup dosyasini /opt/smartadmin/ klasorune kopyalayin."
    echo ""
    echo "Ornek:"
    echo "  scp pos_website_backup.sql root@SUNUCU_IP:/opt/smartadmin/"
    exit 1
fi

echo "Backup dosyasi bulundu: $BACKUP_FILE"
echo ""

# MySQL container'ının çalıştığını kontrol et
if ! docker ps | grep -q smartadmin-mysql; then
    echo "HATA: MySQL container calisiyor degil!"
    echo "Lutfen once Docker Compose'u baslatin:"
    echo "  docker compose up -d mysql"
    exit 1
fi

echo "MySQL container calisiyor."
echo ""

# .env dosyasından root şifresini oku
if [ -f .env ]; then
    DB_ROOT_PASSWORD=$(grep "^DB_ROOT_PASSWORD=" .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
else
    DB_ROOT_PASSWORD="rootpassword"
fi

if [ -z "$DB_ROOT_PASSWORD" ]; then
    DB_ROOT_PASSWORD="rootpassword"
fi

echo "Veritabani import ediliyor..."
echo "NOT: Eger hata alirsaniz, mevcut veritabanini once yedekleyin:"
echo "  docker exec smartadmin-mysql mysqldump -u root -p pos_website > backup_before_import.sql"
echo ""

# Import işlemi
docker exec -i smartadmin-mysql mysql -u root -p"$DB_ROOT_PASSWORD" pos_website < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Import BASARILI!"
    echo "========================================"
    echo ""
    echo "Veritabanini kontrol edin:"
    echo "  docker exec -it smartadmin-mysql mysql -u root -p -e \"USE pos_website; SHOW TABLES;\""
    echo ""
    echo "Backend'i yeniden baslatin:"
    echo "  docker compose restart backend"
    echo ""
else
    echo ""
    echo "========================================"
    echo "Import BASARISIZ!"
    echo "========================================"
    echo ""
    echo "Hata detaylari icin loglari kontrol edin."
    exit 1
fi

