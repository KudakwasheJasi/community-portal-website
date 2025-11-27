import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

type ClientInfo = {
  userId?: string;
  username?: string;
};

@WebSocketGateway({
  cors: {
    origin: '*', // In production, replace with your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('WebsocketGateway');
  private clients: Map<string, ClientInfo> = new Map();

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.clients.set(client.id, {});
    this.server.emit('userCount', this.clients.size);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
    this.server.emit('userCount', this.clients.size);
  }

  @SubscribeMessage('setUserData')
  handleSetUserData(client: Socket, data: ClientInfo): void {
    if (this.clients.has(client.id)) {
      this.clients.set(client.id, {
        ...this.clients.get(client.id),
        ...data
      });
      this.logger.log(`User data set for client ${client.id}: ${JSON.stringify(data)}`);
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    const clientInfo = this.clients.get(client.id) || {};
    this.server.emit('message', {
      ...payload,
      clientId: client.id,
      timestamp: new Date().toISOString(),
      user: {
        id: clientInfo.userId,
        name: clientInfo.username
      }
    });
  }
}
