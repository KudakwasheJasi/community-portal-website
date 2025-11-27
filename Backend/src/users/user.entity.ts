import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Post } from '../posts/post.entity';
import { Event } from '../events/event.entity';
import { EventRegistration } from '../events/event-registration.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @OneToMany(() => Event, event => event.organizer)
  organizedEvents: Event[];

  @OneToMany(() => EventRegistration, registration => registration.user)
  eventRegistrations: EventRegistration[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
