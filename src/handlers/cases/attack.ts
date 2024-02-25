import { dbGame } from 'data/game';
import { dbUsers } from 'data/users';
import {
  createResponseToAttack,
  createResponseToFinish,
  createResponseToWinners,
  updateTurn,
} from 'helpers/response';
import { BSWebSocket, MessageJson } from 'type/type';
import { wss } from '../../ws_server/index';
import { AttackStatus } from 'type/enums';

export function attack(data: MessageJson, ws: BSWebSocket, x: number, y: number) {
  const defendingPlayer = data.data.indexPlayer;
  const opponent = dbGame.getCurrentPlayer();
  if (opponent !== defendingPlayer) {
    dbGame.checkShips(data.data.gameId, opponent, x, y);
    const isHit = dbGame.checkHit(data.data.gameId, opponent, x, y);
    if (isHit === AttackStatus.Killed) {
      const listEmptyButton = dbGame.findSurroundingCells(data.data.gameId, opponent, [y, x]);
      const isFinish = dbGame.finishGame(data.data.gameId, opponent);
      if (isFinish) {
        dbUsers.addWinner(defendingPlayer);
      }
      wss.clients.forEach((client: BSWebSocket) => {
        if (client.id === ws.id || client.id === opponent) {
          listEmptyButton.forEach((attack) => {
            const { x, y, status } = attack;
            const responseAttack = createResponseToAttack(x, y, status, defendingPlayer);
            client.send(responseAttack);
          });
          client.send(updateTurn(opponent));
        }
        if (isFinish) {
          client.send(createResponseToFinish(defendingPlayer));
          client.send(createResponseToWinners());
        }
      });
      dbGame.setCurrentPlayer(defendingPlayer);
    } else if (isHit) {
      const isFinish = dbGame.finishGame(data.data.gameId, opponent);
      if (isFinish) {
        dbUsers.addWinner(defendingPlayer);
      }
      wss.clients.forEach((client: BSWebSocket) => {
        if (client.id === ws.id || client.id === opponent) {
          const responseAttack = createResponseToAttack(x, y, isHit, defendingPlayer);
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
  }
}
