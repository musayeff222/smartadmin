import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Sosyal Medya Ayarları
  @Column({ nullable: true })
  whatsappNumber: string;

  @Column({ nullable: true })
  instagramUrl: string;

  @Column({ nullable: true })
  tiktokUrl: string;

  @Column({ nullable: true })
  facebookUrl: string;

  @Column({ nullable: true })
  twitterUrl: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  // Footer Bilgileri
  @Column({ default: 'SmartCafe' })
  companyName: string;

  @Column({ type: 'text', nullable: true })
  companyDescription: string;

  @Column({ nullable: true })
  contactLink: string;

  @Column({ nullable: true })
  faqLink: string;

  @Column({ nullable: true })
  documentationLink: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  // SEO Ayarları
  @Column({ nullable: true })
  siteTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  metaKeywords: string;

  @Column({ nullable: true })
  faviconUrl: string;

  @Column({ nullable: true })
  logoUrl: string;

  // Key-Value pairs for dynamic settings (like message templates)
  @Column({ nullable: true })
  key: string;

  @Column({ type: 'text', nullable: true })
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

