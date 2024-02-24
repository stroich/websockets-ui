import { dbGame } from 'data/game';
import { dbRooms } from '../data/rooms';
import { dbUsers } from '../data/users';
import {
  createGame,
  createResponseToAttack,
  createResponseToFinish,
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
      const users = dbRooms.findRoom(indexRoom).roomUsers;
      const oldUser = users.find((user) => user.index !== ws.id).index;
      if (isUpdate) {
        dbRooms.deleteRoom(indexRoom);
        const idGame = Date.now();
        wss.clients.forEach((client: BSWebSocket) => {
          if (client.id === oldUser) {
            const responseToCreateGame = createGame(idGame, oldUser);
            client.send(responseToCreateGame);
            client.send(createResponseToUpdateRoom());
          }
          if (client.id === ws.id) {
            const responseToCreateGame = createGame(idGame, ws.id);
            client.send(responseToCreateGame);
            client.send(createResponseToUpdateRoom());
          }
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
        dbGame.setCurrentPlayer(idOpponent);
        wss.clients.forEach((client: BSWebSocket) => {
          responses.forEach((res) => {
            if (client.id === res.playerId) {
              client.send(res.response);
              if (client.id === idOpponent || client.id === ws.id) {
                client.send(updateTurn(ws.id));
              }
            }
          });
        });
      }
      break;

    case 'attack':
      const defendingPlayer = data.data.indexPlayer;
      const opponent = dbGame.getCurrentPlayer();
      if (opponent !== defendingPlayer) {
        const isHit = dbGame.checkHit(data.data.gameId, opponent, data.data.x, data.data.y);
        const isFinish = dbGame.finishGame(data.data.gameId, opponent);
        if (isFinish) {
          dbUsers.addWinner(defendingPlayer);
        }
        wss.clients.forEach((client: BSWebSocket) => {
          if (client.id === ws.id || client.id === opponent) {
            const responseAttack = createResponseToAttack(data.data, isHit, defendingPlayer);
            client.send(responseAttack);
            client.send(updateTurn(opponent));
          }
          if (isFinish) {
            client.send(createResponseToFinish(defendingPlayer));
            client.send(createResponseToWinners());
          }
        });
        dbGame.setCurrentPlayer(defendingPlayer);
      }

      break;

    default:
      console.log('Unknown message type:', data.type);
  }
}
