import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

interface AuthenticatedRequest extends Request {
  user: { id: string; username: string };
}

@Controller('events')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll() {
    try {
      return await this.eventsService.findAll();
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to fetch events',
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.eventsService.findOne(id);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid event ID',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createEventDto: CreateEventDto,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      return await this.eventsService.create(createEventDto, req.user.id);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to create event',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      return await this.eventsService.update(id, updateEventDto, req.user.id);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to update event');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    try {
      await this.eventsService.remove(id, req.user.id);
      return { message: 'Event deleted successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to delete event');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/register')
  async registerForEvent(
    @Param('id') eventId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      return await this.eventsService.registerForEvent(eventId, req.user.id);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to register for event',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/register')
  async unregisterFromEvent(
    @Param('id') eventId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      await this.eventsService.unregisterFromEvent(eventId, req.user.id);
      return { message: 'Successfully unregistered from event' };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to unregister from event',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/registrations')
  async getEventRegistrations(@Param('id') eventId: string) {
    try {
      return await this.eventsService.getEventRegistrations(eventId);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to fetch event registrations',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/registrations')
  async getUserRegistrations(@Request() req: AuthenticatedRequest) {
    try {
      return await this.eventsService.getUserRegistrations(req.user.id);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to fetch user registrations',
      );
    }
  }
}
