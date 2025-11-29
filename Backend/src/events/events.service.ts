import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity.ts';
import { EventRegistration } from './event-registration.entity.ts';

@Injectable()
@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(EventRegistration)
    private registrationRepository: Repository<EventRegistration>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['organizer', 'registrations'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer', 'registrations', 'registrations.user'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async findByOrganizer(organizerId: string): Promise<Event[]> {
    return this.eventRepository.find({
      where: { organizerId },
      relations: ['organizer', 'registrations'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createEventData: Partial<Event>): Promise<Event> {
    const event = this.eventRepository.create(createEventData);
    return this.eventRepository.save(event);
  }

  async update(id: string, updateData: Partial<Event>): Promise<Event> {
    const event = await this.findOne(id);

    Object.assign(event, updateData);
    await this.eventRepository.save(event);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
  }

  async registerForEvent(
    eventId: string,
    userId: string,
  ): Promise<EventRegistration> {
    const event = await this.findOne(eventId);

    // Check if event is full
    if (event.registrations.length >= event.maxAttendees) {
      throw new BadRequestException('Event is full');
    }

    // Check if user is already registered
    const existingRegistration = await this.registrationRepository.findOne({
      where: { eventId, userId },
    });

    if (existingRegistration) {
      throw new BadRequestException(
        'User is already registered for this event',
      );
    }

    const registration = this.registrationRepository.create({
      eventId,
      userId,
    });

    return this.registrationRepository.save(registration);
  }

  async unregisterFromEvent(eventId: string, userId: string): Promise<void> {
    const registration = await this.registrationRepository.findOne({
      where: { eventId, userId },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    await this.registrationRepository.remove(registration);
  }

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    return this.registrationRepository.find({
      where: { eventId },
      relations: ['user'],
    });
  }

  async getUserRegistrations(userId: string): Promise<EventRegistration[]> {
    return this.registrationRepository.find({
      where: { userId },
      relations: ['event'],
    });
  }
}
