import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Post } from '../posts/post.entity.js';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ nullable: true })
  color?: string;

  @ManyToMany(() => Post, post => post.tags)
  posts: Post[];

  @Column({ default: 0 })
  postCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper method to update post count
  updatePostCount(): void {
    this.postCount = this.posts ? this.posts.length : 0;
  }
}
