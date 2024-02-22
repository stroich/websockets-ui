import { WebSocket } from 'ws';

export interface BSWebSocket extends WebSocket {
  id: number;
}
