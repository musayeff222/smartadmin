import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Subscription } from './Subscription';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('text')
  features: string; // JSON string olarak saklanır

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // Aylık fiyat (temel fiyat)

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price1Month: number | null; // 1 ay için özel fiyat (opsiyonel)

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price6Months: number | null; // 6 ay için özel fiyat (opsiyonel)

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price12Months: number | null; // 12 ay için özel fiyat (opsiyonel)

  @Column()
  duration: number; // in days

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  displayOrder: number;

  @OneToMany(() => Subscription, (subscription) => subscription.package)
  subscriptions: Subscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

