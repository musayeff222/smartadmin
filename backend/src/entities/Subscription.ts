import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { Package } from './Package';
import { PaymentLog } from './PaymentLog';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending', // Bekliyor
  PAID = 'paid', // Ödendi
}

export enum PaymentType {
  ONE_TIME = 'one_time', // Tek ödeme
  MONTHLY = 'monthly', // Aylık ödeme
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.subscriptions, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @Column({ nullable: true })
  userId: string | null;

  @ManyToOne(() => Package, (pkg) => pkg.subscriptions)
  @JoinColumn({ name: 'packageId' })
  package: Package;

  @Column()
  packageId: string;

  // Müşteri bilgileri (manuel girilecek)
  @Column({ nullable: true, length: 5 })
  customerId: string; // Müşteri ID (5 rakamlı)

  @Column({ nullable: true })
  customerName: string; // Müşteri Adı

  @Column({ nullable: true })
  customerEmail: string; // Müşteri Email

  @Column({ nullable: true })
  customerPhone: string; // Müşteri Telefon

  @Column({ nullable: true })
  customerLogin: string; // Giriş bilgileri - Login (sadece kayıt/not amaçlı)

  @Column({ nullable: true })
  customerPassword: string; // Giriş bilgileri - Şifre (sadece kayıt/not amaçlı)

  // Restoran bilgileri
  @Column({ nullable: true })
  restaurantName: string; // Restoran Adı

  @Column('text', { nullable: true })
  restaurantAddress: string; // Restoran Adresi

  // Abonelik süresi (ay cinsinden)
  @Column({ default: 1 })
  durationMonths: number; // Kaç ay (1, 3, 6, 12 vb.)

  // Ödeme türü
  @Column({
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.ONE_TIME,
  })
  paymentType: PaymentType; // Tek ödeme veya Aylık ödeme

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus; // Genel ödeme durumu

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number; // Toplam tutar

  @Column('text', { nullable: true })
  notes: string; // Notlar / ekstra hizmetler

  // Ödeme logları (aylık ödemeler için)
  @OneToMany(() => PaymentLog, (paymentLog) => paymentLog.subscription)
  paymentLogs: PaymentLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

