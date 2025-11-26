import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Subscription } from './entities/Subscription';
import { Package } from './entities/Package';
import { ContactMessage } from './entities/ContactMessage';
import { SiteContent } from './entities/SiteContent';
import { Settings } from './entities/Settings';
import { NotificationSubscription } from './entities/NotificationSubscription';
import { PaymentLog } from './entities/PaymentLog';
import { VisitorLog } from './entities/VisitorLog';
import { AdvertisingCustomer } from './entities/AdvertisingCustomer';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pos_website',
  synchronize: process.env.NODE_ENV !== 'production', // Production'da false, development'te true
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Subscription, Package, ContactMessage, SiteContent, Settings, NotificationSubscription, PaymentLog, VisitorLog, AdvertisingCustomer],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  charset: 'utf8mb4',
  extra: {
    // MySQL bağlantı ayarları
    connectionLimit: 10,
  },
});

