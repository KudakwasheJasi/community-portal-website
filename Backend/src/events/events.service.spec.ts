/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventsService } from './events.service';
import { Event, EventStatus } from './event.entity';
import { EventRegistration } from './event-registration.entity';
import { User } from '../users/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';

describe('EventsService', () => {
  let service: EventsService;
  let eventRepository: Repository<Event>;
  let registrationRepository: Repository<EventRegistration>;
  let userRepository: Repository<User>;

  const mockEventRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockRegistrationRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockNotificationsService = {
    sendEventRegistrationConfirmation: jest.fn(),
    sendEventRegistrationNotificationToOrganizer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
        {
          provide: getRepositoryToken(EventRegistration),
          useValue: mockRegistrationRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    registrationRepository = module.get<Repository<EventRegistration>>(
      getRepositoryToken(EventRegistration),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return events from database', async () => {
      const mockEvents = [{ id: '1', title: 'Test Event' }];
      mockEventRepository.find.mockResolvedValue(mockEvents);

      const result = await service.findAll();

      expect(eventRepository.find).toHaveBeenCalledWith({
        relations: ['organizer', 'registrations'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockEvents);
    });

    it('should return sample events when database is empty', async () => {
      mockEventRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('title', 'Community Tech Meetup');
    });

    it('should return sample events when database throws error', async () => {
      mockEventRepository.find.mockRejectedValue(new Error('DB error'));

      const result = await service.findAll();

      expect(result).toHaveLength(3);
    });
  });

  describe('findOne', () => {
    it('should return an event', async () => {
      const mockEvent = { id: '1', title: 'Test Event' };
      mockEventRepository.findOne.mockResolvedValue(mockEvent);

      const result = await service.findOne('1');

      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['organizer', 'registrations', 'registrations.user'],
      });
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException if event not found', async () => {
      mockEventRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new event', async () => {
      const createEventDto: CreateEventDto = {
        title: 'New Event',
        startDate: '2023-12-01T10:00:00Z',
        endDate: '2023-12-01T12:00:00Z',
      };
      const organizerId = 'user-1';
      const mockOrganizer = { id: organizerId, name: 'Test User' };
      const mockEvent = { id: '1', ...createEventDto, organizer: mockOrganizer };

      mockUserRepository.findOne.mockResolvedValue(mockOrganizer);
      mockEventRepository.create.mockReturnValue(mockEvent);
      mockEventRepository.save.mockResolvedValue(mockEvent);

      const result = await service.create(createEventDto, organizerId);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: organizerId },
      });
      expect(eventRepository.create).toHaveBeenCalledWith({
        ...createEventDto,
        startDate: new Date(createEventDto.startDate),
        endDate: new Date(createEventDto.endDate),
        organizerId,
        organizer: mockOrganizer,
        status: EventStatus.PUBLISHED,
      });
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException if organizer not found', async () => {
      const createEventDto: CreateEventDto = {
        title: 'New Event',
        startDate: '2023-12-01T10:00:00Z',
        endDate: '2023-12-01T12:00:00Z',
      };
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createEventDto, 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const updateEventDto: UpdateEventDto = { title: 'Updated Event' };
      const mockEvent = {
        id: '1',
        title: 'Original Event',
        organizerId: 'user-1',
        save: jest.fn(),
      };
      mockEventRepository.findOne = jest.fn().mockResolvedValue(mockEvent);
      mockEventRepository.save.mockResolvedValue({ ...mockEvent, ...updateEventDto });

      const result = await service.update('1', updateEventDto, 'user-1');

      expect(result.title).toBe('Updated Event');
    });

    it('should throw BadRequestException if not authorized', async () => {
      const mockEvent = { id: '1', organizerId: 'user-2' };
      mockEventRepository.findOne = jest.fn().mockResolvedValue(mockEvent);

      await expect(service.update('1', { title: 'Updated' }, 'user-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete an event', async () => {
      const mockEvent = { id: '1', organizerId: 'user-1' };
      mockEventRepository.findOne = jest.fn().mockResolvedValue(mockEvent);
      mockEventRepository.remove.mockResolvedValue(mockEvent);

      await service.remove('1', 'user-1');

      expect(eventRepository.remove).toHaveBeenCalledWith(mockEvent);
    });

    it('should throw BadRequestException if not authorized', async () => {
      const mockEvent = { id: '1', organizerId: 'user-2' };
      mockEventRepository.findOne = jest.fn().mockResolvedValue(mockEvent);

      await expect(service.remove('1', 'user-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('registerForEvent', () => {
    it('should register for an event', async () => {
      const mockEvent = { id: '1', isFull: false };
      const mockUser = { id: 'user-1' };
      const mockRegistration = { id: 'reg-1', eventId: '1', userId: 'user-1' };

      mockEventRepository.findOne = jest.fn().mockResolvedValue(mockEvent);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockRegistrationRepository.findOne.mockResolvedValue(null);
      mockRegistrationRepository.create.mockReturnValue(mockRegistration);
      mockRegistrationRepository.save.mockResolvedValue(mockRegistration);

      const result = await service.registerForEvent('1', 'user-1');

      expect(result).toEqual(mockRegistration);
    });

    it('should throw BadRequestException if event is full', async () => {
      const mockEvent = { id: '1', isFull: true };
      mockEventRepository.findOne = jest.fn().mockResolvedValue(mockEvent);

      await expect(service.registerForEvent('1', 'user-1')).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if already registered', async () => {
      const mockEvent = { id: '1', isFull: false };
      const mockRegistration = { id: 'reg-1' };
      mockEventRepository.findOne = jest.fn().mockResolvedValue(mockEvent);
      mockUserRepository.findOne.mockResolvedValue({ id: 'user-1' });
      mockRegistrationRepository.findOne.mockResolvedValue(mockRegistration);

      await expect(service.registerForEvent('1', 'user-1')).rejects.toThrow(ConflictException);
    });
  });

  describe('unregisterFromEvent', () => {
    it('should unregister from an event', async () => {
      const mockRegistration = { id: 'reg-1' };
      mockRegistrationRepository.findOne.mockResolvedValue(mockRegistration);
      mockRegistrationRepository.remove.mockResolvedValue(mockRegistration);

      await service.unregisterFromEvent('1', 'user-1');

      expect(registrationRepository.remove).toHaveBeenCalledWith(mockRegistration);
    });

    it('should throw NotFoundException if registration not found', async () => {
      mockRegistrationRepository.findOne.mockResolvedValue(null);

      await expect(service.unregisterFromEvent('1', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getEventRegistrations', () => {
    it('should return event registrations', async () => {
      const mockRegistrations = [{ id: 'reg-1', userId: 'user-1' }];
      mockRegistrationRepository.find.mockResolvedValue(mockRegistrations);

      const result = await service.getEventRegistrations('1');

      expect(registrationRepository.find).toHaveBeenCalledWith({
        where: { eventId: '1' },
        relations: ['user'],
        order: { registeredAt: 'ASC' },
      });
      expect(result).toEqual(mockRegistrations);
    });
  });

  describe('getUserRegistrations', () => {
    it('should return user registrations', async () => {
      const mockRegistrations = [{ id: 'reg-1', eventId: '1' }];
      mockRegistrationRepository.find.mockResolvedValue(mockRegistrations);

      const result = await service.getUserRegistrations('user-1');

      expect(registrationRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        relations: ['event'],
        order: { registeredAt: 'DESC' },
      });
      expect(result).toEqual(mockRegistrations);
    });
  });
});