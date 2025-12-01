import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './event.entity';
import { EventRegistration } from './event-registration.entity';
import { User } from '../users/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(EventRegistration)
    private registrationRepository: Repository<EventRegistration>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Event[]> {
    try {
      return await this.eventRepository.find({
        relations: ['organizer', 'registrations'],
        order: { createdAt: 'DESC' },
      });
    } catch {
      // Return sample events when database is not available
      console.warn('Database not available, returning sample events');
      return this.getSampleEvents();
    }
  }

  private getSampleEvents(): Event[] {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Yesterday

    return [
      {
        id: 'sample-1',
        title: 'Community Tech Meetup',
        description:
          'Join us for an exciting discussion about the latest in web development technologies.',
        location: 'Community Center, Main Hall',
        startDate: futureDate,
        endDate: new Date(futureDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
        maxAttendees: 50,
        status: EventStatus.PUBLISHED,
        imageUrl: 'https://via.placeholder.com/400x200?text=Tech+Meetup',
        organizerId: 'sample-user-1',
        organizer: {
          id: 'sample-user-1',
          name: 'John Doe',
          email: 'john@example.com',
          mobileNumber: '+1234567890',
          role: 'user',
          createdAt: pastDate,
          updatedAt: pastDate,
        },
        registrations: [],
        createdAt: pastDate,
        updatedAt: pastDate,
        currentAttendees: 0,
        isFull: false,
      } as unknown as Event,
      {
        id: 'sample-2',
        title: 'Web Development Workshop',
        description:
          'Learn modern web development techniques with hands-on exercises.',
        location: 'Online (Zoom)',
        startDate: new Date(futureDate.getTime() + 24 * 60 * 60 * 1000), // Next day
        endDate: new Date(
          futureDate.getTime() + 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000,
        ), // 3 hours later
        maxAttendees: 25,
        status: EventStatus.PUBLISHED,
        imageUrl: 'https://via.placeholder.com/400x200?text=Workshop',
        organizerId: 'sample-user-2',
        organizer: {
          id: 'sample-user-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          mobileNumber: '+1234567891',
          role: 'user',
          createdAt: pastDate,
          updatedAt: pastDate,
        },
        registrations: [],
        createdAt: pastDate,
        updatedAt: pastDate,
        currentAttendees: 0,
        isFull: false,
      } as unknown as Event,
      {
        id: 'sample-3',
        title: 'Networking Event',
        description:
          'Connect with fellow community members and build professional relationships.',
        location: 'Downtown Conference Center',
        startDate: new Date(futureDate.getTime() + 2 * 24 * 60 * 60 * 1000), // Two days from now
        endDate: new Date(
          futureDate.getTime() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000,
        ), // 4 hours later
        maxAttendees: 100,
        status: EventStatus.PUBLISHED,
        imageUrl: 'https://via.placeholder.com/400x200?text=Networking',
        organizerId: 'sample-user-1',
        organizer: {
          id: 'sample-user-1',
          name: 'John Doe',
          email: 'john@example.com',
          mobileNumber: '+1234567890',
          role: 'user',
          createdAt: pastDate,
          updatedAt: pastDate,
        },
        registrations: [],
        createdAt: pastDate,
        updatedAt: pastDate,
        currentAttendees: 0,
        isFull: false,
      } as unknown as Event,
    ];
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

  async create(
    createEventDto: CreateEventDto,
    organizerId: string,
  ): Promise<Event> {
    const organizer = await this.userRepository.findOne({
      where: { id: organizerId },
    });
    if (!organizer) {
      throw new NotFoundException('Organizer not found');
    }

    const event = this.eventRepository.create({
      ...createEventDto,
      startDate: new Date(createEventDto.startDate),
      endDate: new Date(createEventDto.endDate),
      organizerId,
      organizer,
      status: EventStatus.PUBLISHED, // Default to published for new events
    });

    return this.eventRepository.save(event);
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    userId: string,
  ): Promise<Event> {
    const event = await this.findOne(id);

    // Check if user is the organizer
    if (event.organizerId !== userId) {
      throw new BadRequestException('Not authorized to update this event');
    }

    // Convert date strings to Date objects if provided
    const updateData: Partial<Event> = {};
    if (updateEventDto.title !== undefined)
      updateData.title = updateEventDto.title;
    if (updateEventDto.description !== undefined)
      updateData.description = updateEventDto.description;
    if (updateEventDto.location !== undefined)
      updateData.location = updateEventDto.location;
    if (updateEventDto.startDate !== undefined)
      updateData.startDate = new Date(updateEventDto.startDate);
    if (updateEventDto.endDate !== undefined)
      updateData.endDate = new Date(updateEventDto.endDate);
    if (updateEventDto.maxAttendees !== undefined)
      updateData.maxAttendees = updateEventDto.maxAttendees;
    if (updateEventDto.imageUrl !== undefined)
      updateData.imageUrl = updateEventDto.imageUrl;

    Object.assign(event, updateData);
    return this.eventRepository.save(event);
  }

  async remove(id: string, userId: string): Promise<void> {
    const event = await this.findOne(id);

    // Check if user is the organizer
    if (event.organizerId !== userId) {
      throw new BadRequestException('Not authorized to delete this event');
    }

    await this.eventRepository.remove(event);
  }

  async registerForEvent(
    eventId: string,
    userId: string,
  ): Promise<EventRegistration> {
    const event = await this.findOne(eventId);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if event is full
    if (event.isFull) {
      throw new BadRequestException('Event is full');
    }

    // Check if user is already registered
    const existingRegistration = await this.registrationRepository.findOne({
      where: { eventId, userId },
    });

    if (existingRegistration) {
      throw new ConflictException('User is already registered for this event');
    }

    const registration = this.registrationRepository.create({
      eventId,
      userId,
      event,
      user,
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
      order: { registeredAt: 'ASC' },
    });
  }

  async getUserRegistrations(userId: string): Promise<EventRegistration[]> {
    return this.registrationRepository.find({
      where: { userId },
      relations: ['event'],
      order: { registeredAt: 'DESC' },
    });
  }
}
