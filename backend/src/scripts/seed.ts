import 'reflect-metadata';
import dotenv from 'dotenv';
import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';
import { Package } from '../entities/Package';
import bcrypt from 'bcryptjs';

dotenv.config();

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const userRepository = AppDataSource.getRepository(User);
    const packageRepository = AppDataSource.getRepository(Package);

    // Create or fix super admin user
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@posrestaurant.com' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const superAdmin = userRepository.create({
        email: 'admin@posrestaurant.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: UserRole.SUPER_ADMIN,
        isActive: true,
      });
      await userRepository.save(superAdmin);
      console.log('Super admin user created: admin@posrestaurant.com / admin123');
    } else {
      // Fix existing admin user if any field is missing or invalid
      let needsUpdate = false;
      
      if (!existingAdmin.role || String(existingAdmin.role).trim() === '') {
        console.log('⚠️  Admin user exists but role is missing. Fixing...');
        existingAdmin.role = UserRole.SUPER_ADMIN;
        needsUpdate = true;
      }
      
      if (!existingAdmin.firstName || String(existingAdmin.firstName).trim() === '') {
        console.log('⚠️  Admin user firstName is missing. Fixing...');
        existingAdmin.firstName = 'Super';
        needsUpdate = true;
      }
      
      if (!existingAdmin.lastName || String(existingAdmin.lastName).trim() === '') {
        console.log('⚠️  Admin user lastName is missing. Fixing...');
        existingAdmin.lastName = 'Admin';
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        existingAdmin.isActive = true;
        await userRepository.save(existingAdmin);
        console.log('✅ Admin user fixed: role, firstName, lastName set');
      } else {
        console.log('Super admin user already exists with valid data');
      }
    }

    // Create default packages
    const existingPackages = await packageRepository.count();
    if (existingPackages === 0) {
      const packages = [
        {
          name: 'Temel Paket',
          description: 'Küçük restoranlar için ideal başlangıç paketi',
          features: JSON.stringify([
            'Sipariş yönetimi',
            'Temel stok takibi',
            'Masa yönetimi',
            'Temel raporlar',
            'Email desteği',
          ]),
          price: 299.99,
          duration: 30,
          displayOrder: 1,
          isActive: true,
        },
        {
          name: 'Profesyonel Paket',
          description: 'Orta ölçekli restoranlar için kapsamlı çözüm',
          features: JSON.stringify([
            'Tüm Temel Paket özellikleri',
            'Gelişmiş stok yönetimi',
            'Çoklu kullanıcı desteği',
            'Detaylı raporlar ve analizler',
            'Ödeme entegrasyonu',
            '7/24 telefon desteği',
          ]),
          price: 599.99,
          duration: 30,
          displayOrder: 2,
          isActive: true,
        },
        {
          name: 'Kurumsal Paket',
          description: 'Büyük restoran zincirleri için kurumsal çözüm',
          features: JSON.stringify([
            'Tüm Profesyonel Paket özellikleri',
            'Çoklu şube yönetimi',
            'Merkezi kontrol paneli',
            'Özel entegrasyonlar',
            'Özel eğitim ve danışmanlık',
            'Öncelikli destek',
            'Özel geliştirmeler',
          ]),
          price: 1299.99,
          duration: 30,
          displayOrder: 3,
          isActive: true,
        },
      ];

      for (const pkgData of packages) {
        const pkg = packageRepository.create(pkgData);
        await packageRepository.save(pkg);
      }
      console.log('Default packages created');
    } else {
      console.log('Packages already exist');
    }

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();

