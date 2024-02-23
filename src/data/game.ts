import { requestPlayer } from 'type/type';
import { GameType, Games, Player, ship } from '../type/Game';
import { AttackStatus } from 'type/enums';

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

  findPlayer(gameId: number, playerId: number) {
    const game = this.findGame(gameId);
    return game.players.find((player) => player.index === playerId);
  }

  addShots(ships: Array<ship>) {
    const field = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0));

    for (const ship of ships) {
      const { position, direction, length } = ship;
      const { x, y } = position;

      for (let i = 0; i < length; i++) {
        const cellX = direction ? x : x + i;
        const cellY = direction ? y + i : y;
        field[cellY][cellX] = length;
      }
    }
    return field;
  }

  addShips(data: requestPlayer, id: number) {
    const game = this.findGame(data.gameId);
    const shots = this.addShots(data.ships);
    const player: Player = {
      index: id,
      ships: data.ships,
      shots: shots,
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

  startGame(gameId: number) {
    const game = this.findGame(gameId);
    return game.players.length === 2;
  }

  checkHit(gameId: number, playerId: number, x: number, y: number): AttackStatus {
    const player = this.findPlayer(gameId, playerId);
    let status: AttackStatus;
    const cellValue = player.shots[y][x];
    switch (cellValue) {
      case 0:
        status = AttackStatus.Miss;
        break;
      case 1:
        status = AttackStatus.Killed;
        break;
      case 2:
      case 3:
      case 4:
        status = AttackStatus.Shot;
        break;
    }
    return status;
  }
}
export const dbGame = new Game();
