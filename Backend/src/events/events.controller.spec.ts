import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { BadRequestException } from '@nestjs/common';

describe('EventsController', () => {
  let controller: EventsController;
  let eventsService: EventsService;

  const mockEventsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    registerForEvent: jest.fn(),
    unregisterFromEvent: jest.fn(),
    getEventRegistrations: jest.fn(),
    getUserRegistrations: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    eventsService = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all events', async () => {
      const expectedEvents = [{ id: '1', title: 'Test Event' }];
      mockEventsService.findAll.mockResolvedValue(expectedEvents);

      const result = await controller.findAll();

      expect(eventsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedEvents);
    });

    it('should throw BadRequestException on error', async () => {
      mockEventsService.findAll.mockRejectedValue(new Error('Database error'));

      await expect(controller.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a single event', async () => {
      const expectedEvent = { id: '1', title: 'Test Event' };
      mockEventsService.findOne.mockResolvedValue(expectedEvent);

      const result = await controller.findOne('1');

      expect(eventsService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(expectedEvent);
    });

    it('should throw BadRequestException on error', async () => {
      mockEventsService.findOne.mockRejectedValue(new Error('Event not found'));

      await expect(controller.findOne('1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('should create a new event', async () => {
      const createEventDto: CreateEventDto = {
        title: 'New Event',
        startDate: '2023-12-01T10:00:00Z',
        endDate: '2023-12-01T12:00:00Z',
      };
      const mockRequest = { user: { id: 'user-1' } };
      const expectedEvent = { id: '1', ...createEventDto };
      mockEventsService.create.mockResolvedValue(expectedEvent);

      const result = await controller.create(createEventDto, mockRequest as any);

      expect(eventsService.create).toHaveBeenCalledWith(createEventDto, 'user-1');
      expect(result).toEqual(expectedEvent);
    });

    it('should throw BadRequestException on error', async () => {
      const createEventDto: CreateEventDto = {
        title: 'New Event',
        startDate: '2023-12-01T10:00:00Z',
        endDate: '2023-12-01T12:00:00Z',
      };
      const mockRequest = { user: { id: 'user-1' } };
      mockEventsService.create.mockRejectedValue(new Error('Creation failed'));

      await expect(controller.create(createEventDto, mockRequest as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const updateEventDto: UpdateEventDto = { title: 'Updated Event' };
      const mockRequest = { user: { id: 'user-1' } };
      const expectedEvent = { id: '1', title: 'Updated Event' };
      mockEventsService.update.mockResolvedValue(expectedEvent);

      const result = await controller.update('1', updateEventDto, mockRequest as any);

      expect(eventsService.update).toHaveBeenCalledWith('1', updateEventDto, 'user-1');
      expect(result).toEqual(expectedEvent);
    });

    it('should throw BadRequestException on error', async () => {
      const updateEventDto: UpdateEventDto = { title: 'Updated Event' };
      const mockRequest = { user: { id: 'user-1' } };
      mockEventsService.update.mockRejectedValue(new Error('Update failed'));

      await expect(controller.update('1', updateEventDto, mockRequest as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete an event', async () => {
      const mockRequest = { user: { id: 'user-1' } };
      mockEventsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1', mockRequest as any);

      expect(eventsService.remove).toHaveBeenCalledWith('1', 'user-1');
      expect(result).toEqual({ message: 'Event deleted successfully' });
    });

    it('should throw BadRequestException on error', async () => {
      const mockRequest = { user: { id: 'user-1' } };
      mockEventsService.remove.mockRejectedValue(new Error('Deletion failed'));

      await expect(controller.remove('1', mockRequest as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('registerForEvent', () => {
    it('should register for an event', async () => {
      const mockRequest = { user: { id: 'user-1' } };
      const expectedRegistration = { id: 'reg-1', eventId: '1', userId: 'user-1' };
      mockEventsService.registerForEvent.mockResolvedValue(expectedRegistration);

      const result = await controller.registerForEvent('1', mockRequest as any);

      expect(eventsService.registerForEvent).toHaveBeenCalledWith('1', 'user-1');
      expect(result).toEqual(expectedRegistration);
    });

    it('should throw BadRequestException on error', async () => {
      const mockRequest = { user: { id: 'user-1' } };
      mockEventsService.registerForEvent.mockRejectedValue(new Error('Registration failed'));

      await expect(controller.registerForEvent('1', mockRequest as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('unregisterFromEvent', () => {
    it('should unregister from an event', async () => {
      const mockRequest = { user: { id: 'user-1' } };
      mockEventsService.unregisterFromEvent.mockResolvedValue(undefined);

      const result = await controller.unregisterFromEvent('1', mockRequest as any);

      expect(eventsService.unregisterFromEvent).toHaveBeenCalledWith('1', 'user-1');
      expect(result).toEqual({ message: 'Successfully unregistered from event' });
    });

    it('should throw BadRequestException on error', async () => {
      const mockRequest = { user: { id: 'user-1' } };
      mockEventsService.unregisterFromEvent.mockRejectedValue(new Error('Unregistration failed'));

      await expect(controller.unregisterFromEvent('1', mockRequest as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getEventRegistrations', () => {
    it('should return event registrations', async () => {
      const expectedRegistrations = [{ id: 'reg-1', userId: 'user-1' }];
      mockEventsService.getEventRegistrations.mockResolvedValue(expectedRegistrations);

      const result = await controller.getEventRegistrations('1');

      expect(eventsService.getEventRegistrations).toHaveBeenCalledWith('1');
      expect(result).toEqual(expectedRegistrations);
    });

    it('should throw BadRequestException on error', async () => {
      mockEventsService.getEventRegistrations.mockRejectedValue(new Error('Fetch failed'));

      await expect(controller.getEventRegistrations('1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserRegistrations', () => {
    it('should return user registrations', async () => {
      const mockRequest = { user: { id: 'user-1' } };
      const expectedRegistrations = [{ id: 'reg-1', eventId: '1' }];
      mockEventsService.getUserRegistrations.mockResolvedValue(expectedRegistrations);

      const result = await controller.getUserRegistrations(mockRequest as any);

      expect(eventsService.getUserRegistrations).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(expectedRegistrations);
    });

    it('should throw BadRequestException on error', async () => {
      const mockRequest = { user: { id: 'user-1' } };
      mockEventsService.getUserRegistrations.mockRejectedValue(new Error('Fetch failed'));

      await expect(
        controller.getUserRegistrations(mockRequest as any),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

function expect(remove: (id: string, userId: string) => Promise<void>) {
    throw new Error('Function not implemented.');
}
