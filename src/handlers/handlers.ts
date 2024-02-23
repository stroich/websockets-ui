import { dbGame } from 'data/game';
import { dbRooms } from '../data/rooms';
import { dbUsers } from '../data/users';
import {
  createGame,
  createResponseToAttack,
  createResponseToRegistration,
  createResponseToUpdateRoom,
  createResponseToWinners,
  startGame,
  updateTurn,
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
        const responseToCreateGame = createGame(ws.id);
        wss.clients.forEach((client: BSWebSocket) => {
          client.send(responseToCreateGame);
          client.send(createResponseToUpdateRoom());
        });
      }
      break;

    case 'add_ships':
      dbGame.addShips(data.data, ws.id);
      const newGame = dbGame.findGame(data.data.gameId);
      const isStart = dbGame.startGame(data.data.gameId);
      if (isStart) {
        const responses = startGame(newGame);
        const idOpponent = responses.find((player) => player.playerId !== ws.id).playerId;
        wss.clients.forEach((client: BSWebSocket) => {
          responses.forEach((res) => {
            if (client.id === res.playerId) {
              client.send(res.response);
              if (client.id === idOpponent) {
                client.send(updateTurn(ws.id));
              }
              if (client.id === ws.id) {
                client.send(updateTurn(idOpponent));
              }
            }
          });
        });
      }
      break;

    case 'attack':
      const defendingPlayer = data.data.indexPlayer;
      const isDefendingPlayer = defendingPlayer === ws.id;
      if (!isDefendingPlayer) {
        const isHit = dbGame.checkHit(
          data.data.gameId,
          data.data.indexPlayer,
          data.data.x,
          data.data.y
        );
        console.log(ws.id, defendingPlayer);
        wss.clients.forEach((client: BSWebSocket) => {
          if (client.id === defendingPlayer) {
            const responseAttack = createResponseToAttack(data.data, isHit, ws.id);
            client.send(responseAttack);
            client.send(updateTurn(ws.id));
          }
          if (client.id === ws.id) {
            const responseAttack = createResponseToAttack(data.data, isHit, defendingPlayer);
            client.send(responseAttack);
            client.send(updateTurn(ws.id));
          }
        });
      }

      break;

    default:
      console.log('Unknown message type:', data.type);
  }
}
