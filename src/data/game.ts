import { requestPlayer } from 'type/type';
import { GameType, Games, Player } from '../type/Game';

class Game {
  private readonly games: Games;
  constructor() {
    this.games = [];
  }

  getAllGame() {
    return this.games;
  }

  findGame(gameId) {
    return this.games.find((game) => game.gameId === gameId);
  }

  addShips(data: requestPlayer) {
    const game = this.findGame(data.gameId);
    const player: Player = {
      index: data.indexPlayer,
      ships: data.ships,
      shots: [],
    };
    if (game) {
      game.players.push(player);
    } else {
      const game: GameType = {
        gameId: data.gameId,
        players: [player],
      };
      this.games.push(game);
    }
  }
}

export const dbGame = new Game();
