import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('site_contents')
export class SiteContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string; // e.g., 'homepage_hero_title', 'features_intro', etc.

  @Column('text')
  content: string;

  @Column({ nullable: true })
  type: string; // 'text', 'html', 'image_url', etc.

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

