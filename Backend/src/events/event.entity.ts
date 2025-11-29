import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity.ts';
import { EventRegistration } from './event-registration.entity.ts';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column('int')
  maxAttendees: number;

  @Column('uuid')
  organizerId: string;

  @ManyToOne(() => User, (user) => user.organizedEvents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @OneToMany(() => EventRegistration, (registration) => registration.event)
  registrations: EventRegistration[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
