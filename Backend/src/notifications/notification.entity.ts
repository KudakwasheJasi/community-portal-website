import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity.js';

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  EVENT_REMINDER = 'event_reminder',
  NEW_COMMENT = 'new_comment',
  NEW_LIKE = 'new_like',
  MENTION = 'mention',
  SYSTEM = 'system'
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived'
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: NotificationType.INFO
  })
  type: NotificationType;

  @Column('text')
  message: string;

  @Column('simple-json', { nullable: true })
  metadata?: Record<string, any>;

  @Column({
    type: 'varchar',
    length: 20,
    default: NotificationStatus.UNREAD
  })
  status: NotificationStatus;

  // Relations
  @ManyToOne(() => User, user => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @Column('uuid')
  recipientId: string;

  @Column({ nullable: true })
  relatedEntityType?: string;

  @Column({ nullable: true })
  relatedEntityId?: string;

  @CreateDateColumn()
  createdAt: Date;

  // Helper methods
  markAsRead(): void {
    this.status = NotificationStatus.READ;
  }

  archive(): void {
    this.status = NotificationStatus.ARCHIVED;
  }
}
