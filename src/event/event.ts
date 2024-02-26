import { dbGame } from 'data/game';
import EventEmitter from 'events';
import { attack } from 'handlers/cases/attack';
import { BSWebSocket } from 'type/type';

export const emitter = new EventEmitter();

const eventName = 'attackBot';

type dataType = {
  ws: BSWebSocket;
  gameId: number;
  botId: number;
};

emitter.on(eventName, (data: dataType) => {
  const opponent = dbGame.getCurrentPlayer();
  const [y, x] = dbGame.findFirstNonNegativeCoord(data.gameId, opponent);
  const customData = {
    type: 'randomAttack',
    data: {
      gameId: data.gameId,
      indexPlayer: data.botId,
    },
    id: 0,
  };
  attack(customData, data.ws, x, y);
});

// Инициируем событие
// emitter.emit(eventName, { message: 'Привет!' });
