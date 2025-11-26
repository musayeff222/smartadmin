import 'reflect-metadata';
import dotenv from 'dotenv';
import { AppDataSource } from '../data-source';

dotenv.config();

async function addCustomerLoginPassword() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // customerLogin kolonunu ekle
      const hasLoginColumn = await queryRunner.query(`
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'subscriptions' 
        AND COLUMN_NAME = 'customerLogin'
      `);

      if (hasLoginColumn[0].count === 0) {
        await queryRunner.query(`
          ALTER TABLE subscriptions 
          ADD COLUMN customerLogin VARCHAR(255) NULL
        `);
        console.log('✅ customerLogin kolonu eklendi');
      } else {
        console.log('ℹ️ customerLogin kolonu zaten mevcut');
      }

      // customerPassword kolonunu ekle
      const hasPasswordColumn = await queryRunner.query(`
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'subscriptions' 
        AND COLUMN_NAME = 'customerPassword'
      `);

      if (hasPasswordColumn[0].count === 0) {
        await queryRunner.query(`
          ALTER TABLE subscriptions 
          ADD COLUMN customerPassword VARCHAR(255) NULL
        `);
        console.log('✅ customerPassword kolonu eklendi');
      } else {
        console.log('ℹ️ customerPassword kolonu zaten mevcut');
      }

      await queryRunner.commitTransaction();
      console.log('\n✅ İşlem başarıyla tamamlandı!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

addCustomerLoginPassword();

