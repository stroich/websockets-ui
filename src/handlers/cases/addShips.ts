import { dbGame } from 'data/game';
import { startGame, updateTurn } from 'helpers/response';
import { BSWebSocket, MessageJson } from 'type/type';
import { wss } from '../../ws_server/index';

export function addShips(data: MessageJson, ws: BSWebSocket) {
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
}
