import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebsocketGateway } from './websocket.gateway.js';
import { EventsModule } from '../events/events.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventsModule,
  ],
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}
