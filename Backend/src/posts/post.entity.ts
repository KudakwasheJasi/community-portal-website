import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';
import { Like } from '../likes/like.entity';
import { Category } from '../categories/category.entity';
import { Tag } from '../tags/tag.entity';

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
  likeCount: number;

  @Column({ default: 0 })
  commentCount: number;

  @Column('uuid')
  authorId: string;

  @ManyToOne(() => User, (user: User) => user.posts as Post[], {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @OneToMany(() => Comment, (comment: Comment) => comment.post, {
    lazy: true,
  })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @ManyToMany(() => Category, (category) => category.posts, { cascade: true })
  @JoinTable({
    name: 'post_categories',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ManyToMany(() => Tag, (tag: Tag) => tag.posts, { cascade: true })
  @JoinTable({
    name: 'post_tags',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];

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

  updateLikeCount(): void {
    this.likeCount = this.likes ? this.likes.length : 0;
  }

  updateCommentCount(): void {
    this.commentCount = this.comments ? this.comments.length : 0;
  }
}
