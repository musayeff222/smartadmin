import { AppDataSource } from '../data-source';
import { Package } from '../entities/Package';

async function createDemoPackage() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const packageRepository = AppDataSource.getRepository(Package);

    // Demo paket oluştur
    const demoPackage = packageRepository.create({
      name: 'Demo Paket',
      description: 'Bu bir demo pakettir. Restoran yönetimi için temel özellikler içerir.',
      features: JSON.stringify([
        'Sınırsız ürün yönetimi',
        'Masa rezervasyon sistemi',
        'Temel raporlama',
        'Mobil uyumlu arayüz',
        'Email desteği',
        'Aylık güncellemeler'
      ]),
      price: 99.99, // Aylık fiyat
      price1Month: 99.99, // 1 ay için özel fiyat
      price6Months: 549.99, // 6 ay için özel fiyat (yaklaşık %8 indirim)
      price12Months: 999.99, // 12 ay için özel fiyat (yaklaşık %17 indirim)
      duration: 30, // 30 gün
      displayOrder: 0,
      isActive: true,
    });

    await packageRepository.save(demoPackage);
    console.log('✅ Demo paket başarıyla oluşturuldu!');
    console.log('Paket ID:', demoPackage.id);
    console.log('Paket Adı:', demoPackage.name);
    console.log('Aylık Fiyat:', demoPackage.price, 'AZN');
    console.log('1 Ay Fiyat:', demoPackage.price1Month, 'AZN');
    console.log('6 Ay Fiyat:', demoPackage.price6Months, 'AZN');
    console.log('12 Ay Fiyat:', demoPackage.price12Months, 'AZN');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

createDemoPackage();
