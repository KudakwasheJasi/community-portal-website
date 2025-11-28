import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, Tree, TreeChildren, TreeParent, TreeLevelColumn } from 'typeorm';
import { Post } from '../posts/post.entity.js';

@Entity('categories')
@Tree('materialized-path')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @TreeChildren()
  children: Category[];

  @TreeParent({ onDelete: 'CASCADE' })
  parent: Category;

  @TreeLevelColumn()
  level: number;

  @ManyToMany(() => Post, post => post.categories)
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
