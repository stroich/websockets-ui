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
import { wss } from '../ws_server/index';
import { attack } from './cases/attack';
import { singlePlay } from './cases/single_Play';
import { addShips } from './cases/addShips';

export function messageHandlers(data: MessageJson, ws: BSWebSocket) {
  const user = dbUsers.getUser(ws.id);

  switch (data.type) {
    case 'reg':
      const { name, password } = data.data;
      const currentUser = dbUsers.findUser(name, password);
      if (!currentUser) {
        const newUser = dbUsers.registerUser(name, password, ws.id);
        ws.send(createResponseToRegistration(name, newUser));
      } else {
        ws.send(createResponseToRegistration(undefined, currentUser));
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
      const users = dbRooms.findRoom(indexRoom).roomUsers;

      if (isUpdate) {
        const oldUser = users.find((user) => user.index !== ws.id);
        const index = oldUser.index;
        dbRooms.deleteRoom(indexRoom);
        const idGame = Date.now();
        wss.clients.forEach((client: BSWebSocket) => {
          if (client.id === index) {
            const responseToCreateGame = createGame(idGame, index);
            client.send(responseToCreateGame);
            client.send(createResponseToUpdateRoom());
          }
          if (client.id === ws.id) {
            const responseToCreateGame = createGame(idGame, ws.id);
            client.send(responseToCreateGame);
            client.send(createResponseToUpdateRoom());
          }
        });
      } else {
        console.log('The client is already in the room');
      }
      break;

    case 'add_ships':
      addShips(data, ws);
      break;

    case 'attack':
      attack(data, ws, data.data.x, data.data.y);
      break;

    case 'randomAttack':
      const opponent = dbGame.getCurrentPlayer();
      const [y, x] = dbGame.findFirstNonNegativeCoord(data.data.gameId, opponent);
      attack(data, ws, x, y);
      break;

    case 'single_play':
      singlePlay(ws);
      break;

    default:
      console.log('Unknown message type:', data.type);
  }
}
