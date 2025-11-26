import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notification_subscriptions')
export class NotificationSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  endpoint: string; // Push notification endpoint URL

  @Column({ nullable: true })
  p256dh: string; // Public key

  @Column({ nullable: true })
  auth: string; // Auth secret

  @Column({ nullable: true })
  userAgent: string; // Browser/device info

  @Column({ nullable: true })
  userId: string; // Optional: if user is logged in

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

