import { dbGame } from 'data/game';
import { dbRooms } from '../data/rooms';
import { dbUsers } from '../data/users';
import {
  createGame,
  createResponseToRegistration,
  createResponseToUpdateRoom,
  createResponseToWinners,
} from '../helpers/response';
import { BSWebSocket, MessageJson } from '../type/type';

export function messageHandlers(data: MessageJson, ws: BSWebSocket, wss) {
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
        dbRooms.deleteRoom(indexRoom);
        wss.clients.forEach((client: BSWebSocket) => {
          client.send(createGame(ws.id));
          client.send(createResponseToUpdateRoom());
        });
      }
      break;

    case 'add_ships':
      dbGame.addShips(data.data);
      break;

    default:
      console.log('Unknown message type:', data.type);
  }
}
