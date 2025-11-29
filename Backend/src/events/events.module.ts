import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity.ts';
import { EventRegistration } from './event-registration.entity.ts';
import { EventsController } from './events.controller.ts';
import { EventsService } from './events.service.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventRegistration])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
