import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum FileType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  ARCHIVE = 'archive',
  OTHER = 'other'
}

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalName: string;

  @Column()
  fileName: string;

  @Column()
  mimeType: string;

  @Column('bigint')
  size: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: FileType.OTHER
  })
  type: FileType;

  @Column()
  path: string;

  @Column({ nullable: true })
  altText?: string;

  @Column('simple-json', { nullable: true })
  metadata?: Record<string, any>;

  @Column({ default: 0 })
  downloadCount: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy?: User;

  @Column('uuid', { nullable: true })
  uploadedById?: string;

  @CreateDateColumn()
  uploadedAt: Date;

  @Column({ default: false })
  isPublic: boolean;

  // Helper method to get file URL
  getUrl(baseUrl: string): string {
    return `${baseUrl}/uploads/${this.path}`;
  }

  // Helper method to get thumbnail URL if it's an image
  getThumbnailUrl(baseUrl: string, size: 'small' | 'medium' | 'large' = 'medium'): string | null {
    if (this.type !== FileType.IMAGE) return null;
    return `${baseUrl}/uploads/thumbnails/${size}/${this.path}`;
  }
}
