import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';

export enum LikeType {
  POST = 'post',
  COMMENT = 'comment'
}

@Entity('likes')
@Index(['userId', 'postId'], { unique: true, where: '"postId" IS NOT NULL' })
@Index(['userId', 'commentId'], { unique: true, where: '"commentId" IS NOT NULL' })
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: LikeType,
    nullable: false
  })
  type: LikeType;

  // Relations
  @ManyToOne(() => User, user => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => Post, post => post.likes, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'postId' })
  post?: Post;

  @Column('uuid', { nullable: true })
  postId?: string;

  @ManyToOne(() => Comment, comment => comment.likes, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'commentId' })
  comment?: Comment;

  @Column('uuid', { nullable: true })
  commentId?: string;

  @CreateDateColumn()
  createdAt: Date;

  // Helper method to set the relation based on type
  setTarget(target: Post | Comment): void {
    if (target instanceof Post) {
      this.post = target;
      this.type = LikeType.POST;
      this.postId = target.id;
    } else if (target instanceof Comment) {
      this.comment = target;
      this.type = LikeType.COMMENT;
      this.commentId = target.id;
    }
  }
}
