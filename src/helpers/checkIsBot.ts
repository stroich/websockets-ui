import { dbBot } from 'data/bot';
import { emitter } from 'event/event';
import { BSWebSocket } from 'type/type';

export function checkIsBot(ws: BSWebSocket, gameId: number, playerId: number) {
  const botId = dbBot.findBot(gameId);
  if (playerId === botId) {
    const message = {
      ws: ws,
      gameId: gameId,
      botId: botId,
    };
    setTimeout(() => {
      emitter.emit('attackBot', message);
    }, 1000);
  }
}
