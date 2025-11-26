import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subscription } from './Subscription';

export enum PaymentLogStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

@Entity('payment_logs')
export class PaymentLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Subscription, (subscription) => subscription.paymentLogs)
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;

  @Column()
  subscriptionId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number; // Bu ayın ödeme tutarı

  @Column()
  month: number; // 1-12 arası ay numarası

  @Column()
  year: number; // Yıl

  @Column({
    type: 'enum',
    enum: PaymentLogStatus,
    default: PaymentLogStatus.PENDING,
  })
  status: PaymentLogStatus;

  @Column({ nullable: true })
  paymentDate: Date; // Ödeme yapıldığı tarih

  @Column('text', { nullable: true })
  notes: string; // Ödeme notları

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

