import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity.ts';
import { Event } from './event.entity.ts';

@Entity('event_registrations')
@Index(['userId', 'eventId'])
@Unique(['userId', 'eventId'])
export class EventRegistration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  eventId: string;

  @ManyToOne(() => User, (user) => user.eventRegistrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Event, (event) => event.registrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column({ default: false })
  emailSent: boolean;

  @CreateDateColumn()
  registeredAt: Date;
}
