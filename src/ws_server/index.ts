import { parseJson } from 'helpers/parseJson';
import { WS_PORT } from '../constants/constants';
import { WebSocketServer } from 'ws';
import { messageHandlers } from 'handlers/handlers';
import { BSWebSocket } from 'type/type';
import { dbUsers } from 'data/users';
import { dbRooms } from 'data/rooms';
import { dbGame } from 'data/game';

export const wss = new WebSocketServer(
  {
    port: WS_PORT,
  },
  () => {
    console.log(`Start Websocked on the ${WS_PORT} port`);
  }
);

wss.on('connection', (client: BSWebSocket) => {
  client.id = Date.now();
  console.log('New client connected');

  client.on('message', (message: string) => {
    const parsedMessage = parseJson(message);
    messageHandlers(parsedMessage, client);
  });

  client.on('close', () => {
    dbUsers.deleteUser(client.id);
    dbRooms.deleteRoomWithCertainUser(client.id);
    dbGame.removePlayerFromGame(client.id);
    console.log('Client disconnected');
  });
});
