import { BSWebSocket } from 'type/type';
import { createGame } from 'helpers/response';
import { dbGame } from 'data/game';
import { shipsForBot } from 'constants/shipsForBots';
import { dbBot } from 'data/bot';
import { dbUsers } from 'data/users';

export function singlePlay(ws: BSWebSocket) {
  const idGame = Date.now();
  const idBot = Date.now() - 1000;
  const botData = {
    gameId: idGame,
    idBot: idBot,
  };
  dbBot.createBot(botData);
  dbUsers.registerUser('bot', '', idBot);
  const responseToCreateGame = createGame(idGame, ws.id);
  ws.send(responseToCreateGame);
  const ships = shipsForBot(idGame, idBot);
  dbGame.addShips(ships, idBot);
  dbGame.setCurrentPlayer(ws.id);
}
