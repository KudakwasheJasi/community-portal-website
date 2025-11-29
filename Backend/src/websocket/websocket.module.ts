import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebsocketGateway } from './websocket.gateway.ts';
import { EventsModule } from '../events/events.module.ts';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventsModule,
  ],
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}
