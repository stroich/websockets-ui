import { db } from '../data/users';
import { createResponseToRegistration } from 'helpers/response';

export function messageHandlers(data, ws) {
  switch (data.type) {
    case 'reg':
      const { name, password } = data.data;
      const user = db.registerUser(name, password);
      ws.send(createResponseToRegistration(name, user));
      break;

    default:
      console.log('Unknown message type:', data.type);
  }
}
