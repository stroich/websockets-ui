import { dbRooms } from '../data/rooms';
import { dbUsers } from '../data/users';
import {
  createResponseToRegistration,
  createResponseToUpdateRoom,
  createResponseToWinners,
} from '../helpers/response';
import { BSWebSocket } from '../type/type';

export function messageHandlers(data, ws: BSWebSocket, wss) {
  const user = dbUsers.getUser(ws.id);

  switch (data.type) {
    case 'reg':
      const { name, password } = data.data;
      const currentUser = dbUsers.findUser(name, password);
      if (!currentUser) {
        const newUser = dbUsers.registerUser(name, password, ws.id);
        ws.send(createResponseToRegistration(name, newUser));
      } else {
        ws.id = currentUser.index;
        ws.send(createResponseToRegistration(name, currentUser));
      }
      ws.send(createResponseToWinners());
      ws.send(createResponseToUpdateRoom());
      break;

    case 'create_room':
      const roomId = dbRooms.createRoom();
      dbRooms.updateRoom(roomId, ws.id, user.name);
      ws.send(createResponseToUpdateRoom());
      break;

    case 'add_user_to_room':
      const { indexRoom } = data.data;
      const isUpdate = dbRooms.updateRoom(indexRoom, ws.id, user.name);
      if (isUpdate) {
        wss.clients.forEach((client) => {
          client.send(createResponseToUpdateRoom());
        });
      }
      break;

    default:
      console.log('Unknown message type:', data.type);
  }
}
