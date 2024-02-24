import { requestPlayer } from 'type/type';
import { GameType, Games, Player, ship } from '../type/Game';
import { AttackStatus } from 'type/enums';

class Game {
  private games: Games;
  private currentPlayer: number;
  constructor() {
    this.games = [];
    this.currentPlayer;
  }

  setCurrentPlayer(player: number) {
    this.currentPlayer = player;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getAllGame() {
    return this.games;
  }

  findGame(gameId: number) {
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

  replaceElement(gameId: number, playerId: number, x: number, y: number) {
    const indGame = this.games.findIndex((game) => game.gameId === gameId);
    const indexPlayer = this.games[indGame].players.findIndex(
      (player) => player.index === playerId
    );
    this.games[indGame].players[indexPlayer].shots[y][x] = -1;
  }

  findFirstNonNegativeCoord(gameId: number, playerId: number) {
    const matrix = this.findPlayer(gameId, playerId).shots;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] !== -1) {
          return [i, j];
        }
      }
    }

    return [-1, -1];
  }

  countElements(gameId: number, playerId: number) {
    const shots = this.findPlayer(gameId, playerId).shots;
    const counts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    };

    for (let i = 0; i < shots.length; i++) {
      for (let j = 0; j < shots[0].length; j++) {
        const element = shots[i][j];
        if (element >= 1 && element <= 4) {
          counts[element]++;
        }
      }
    }

    return counts;
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

  checkHit(gameId: number, playerId: number, x: number, y: number): AttackStatus | false {
    const player = this.findPlayer(gameId, playerId);
    let status: AttackStatus;
    const cellValue = player.shots[y][x];
    this.replaceElement(gameId, playerId, x, y);
    const numberOfShips = this.countElements(gameId, playerId);
    switch (cellValue) {
      case 0:
        status = AttackStatus.Miss;
        break;
      case 1:
        status = AttackStatus.Killed;
        break;
      case 2:
        if (numberOfShips[2] % 2) {
          status = AttackStatus.Shot;
        } else {
          status = AttackStatus.Killed;
        }
        break;
      case 3:
        if (numberOfShips[3] % 3) {
          status = AttackStatus.Shot;
        } else {
          status = AttackStatus.Killed;
        }
        break;
      case 4:
        if (numberOfShips[4]) {
          status = AttackStatus.Shot;
        } else {
          status = AttackStatus.Killed;
        }
        break;
      default:
        return false;
    }
    return status;
  }

  finishGame(gameId: number, playerId: number) {
    const numberOfShips = this.countElements(gameId, playerId);
    for (const key in numberOfShips) {
      if (numberOfShips[key] !== 0) {
        return false;
      }
    }
    return true;
  }
}
export const dbGame = new Game();
