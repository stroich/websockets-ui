import { dbUsers } from '../data/users';
import {
  createResponseToRegistration,
  createResponseToUpdateRoom,
  createResponseToWinners,
} from 'helpers/response';

export function messageHandlers(data, ws) {
  switch (data.type) {
    case 'reg':
      const { name, password } = data.data;
      const user = dbUsers.registerUser(name, password);
      ws.send(createResponseToRegistration(name, user));
      ws.send(createResponseToWinners());
      ws.send(createResponseToUpdateRoom());
      break;

    default:
      console.log('Unknown message type:', data.type);
  }
}
