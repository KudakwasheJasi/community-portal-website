import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request, 
  ParseUUIDPipe, 
  UseInterceptors, 
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.ts';
import { EventsService } from './events.service.ts';
import { Event } from './event.entity.ts';
import { EventRegistration } from './event-registration.entity.ts';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, description: 'Return all events.' })
  async findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'Return the event.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  @Get('organizer/:organizerId')
  @UseGuards(JwtAuthGuard)
  findByOrganizer(@Param('organizerId', ParseUUIDPipe) organizerId: string): Promise<Event[]> {
    return this.eventsService.findByOrganizer(organizerId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createEventData: Partial<Event>, @Request() req): Promise<Event> {
    return this.eventsService.create({
      ...createEventData,
      organizerId: req.user.id,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateData: Partial<Event>): Promise<Event> {
    return this.eventsService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.eventsService.remove(id);
  }

  @Post(':id/register')
  @UseGuards(JwtAuthGuard)
  registerForEvent(@Param('id', ParseUUIDPipe) eventId: string, @Request() req): Promise<EventRegistration> {
    return this.eventsService.registerForEvent(eventId, req.user.id);
  }

  @Delete(':id/register')
  @UseGuards(JwtAuthGuard)
  unregisterFromEvent(@Param('id', ParseUUIDPipe) eventId: string, @Request() req): Promise<void> {
    return this.eventsService.unregisterFromEvent(eventId, req.user.id);
  }

  @Get(':id/registrations')
  @UseGuards(JwtAuthGuard)
  getEventRegistrations(@Param('id', ParseUUIDPipe) eventId: string): Promise<EventRegistration[]> {
    return this.eventsService.getEventRegistrations(eventId);
  }

  @Get('user/registrations')
  @UseGuards(JwtAuthGuard)
  getUserRegistrations(@Request() req): Promise<EventRegistration[]> {
    return this.eventsService.getUserRegistrations(req.user.id);
  }
}
