import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export enum PostVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  excerpt?: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  featuredImage?: string;

  @Column('simple-array', { nullable: true })
  images?: string[];

  @Column({
    type: 'varchar',
    length: 20,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Column({
    type: 'varchar',
    length: 20,
    default: PostVisibility.PUBLIC,
  })
  visibility: PostVisibility;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  commentCount: number;

  @Column('uuid')
  authorId: string;

  @ManyToOne(() => User, (user: User) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @OneToMany(() => Comment, (comment: Comment) => comment.post, {
    lazy: true,
  })
  comments: Comment[];

  @Column({ nullable: true })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property to check if current user liked the post
  isLiked?: boolean;

  // Helper methods
  incrementViewCount(): void {
    this.viewCount += 1;
  }

  updateCommentCount(): void {
    this.commentCount = this.comments ? this.comments.length : 0;
  }
}
