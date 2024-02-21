import { parseJson } from 'helpers/parseJson';
import { WS_PORT } from '../constants/constants';
import { WebSocketServer } from 'ws';
import { messageHandlers } from 'handlers/handlers';

export const wss = new WebSocketServer(
  {
    port: WS_PORT,
  },
  () => {
    console.log(`Start Websocked on the ${WS_PORT} port`);
  }
);

wss.on('connection', (client) => {
  console.log('New client connected');

  client.on('message', (message: string) => {
    const parsedMessage = parseJson(message);
    messageHandlers(parsedMessage, client);
  });

  client.on('close', () => {
    console.log('Client disconnected');
  });
});
