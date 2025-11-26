import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('visitor_logs')
export class VisitorLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  deviceId: string; // Aynı cihazdan gelen ziyaretleri gruplamak için

  @Column({ nullable: true })
  referer: string;

  @Column({ nullable: true })
  path: string; // Hangi sayfaya giriş yapıldı

  @CreateDateColumn()
  createdAt: Date;
}


