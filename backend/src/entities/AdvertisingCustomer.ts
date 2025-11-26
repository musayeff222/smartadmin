import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AdvertisingChannel {
  WHATSAPP = 'whatsapp',
  INSTAGRAM = 'instagram',
  TIKTOK = 'tiktok',
  FACEBOOK = 'facebook',
}

@Entity('advertising_customers')
export class AdvertisingCustomer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerName: string;

  @Column()
  phone: string;

  @Column()
  restaurantName: string;

  @Column({ type: 'int', nullable: true })
  tableCount: number | null;

  @Column({ type: 'boolean', default: false })
  qrMenuRequest: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({
    type: 'enum',
    enum: AdvertisingChannel,
    default: AdvertisingChannel.WHATSAPP,
  })
  channel: AdvertisingChannel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

