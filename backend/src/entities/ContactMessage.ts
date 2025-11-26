import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MessageStatus {
  NEW = 'new',
  READ = 'read',
  REPLIED = 'replied',
}

@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  userAgent: string; // Tarayıcı/cihaz bilgisi

  @Column({ nullable: true })
  deviceId: string; // Cihaz tanımlayıcı (telefon numarası + email hash)

  @Column()
  subject: string;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.NEW,
  })
  status: MessageStatus;

  @Column({ nullable: true })
  reply: string;

  @Column({ nullable: true })
  repliedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

