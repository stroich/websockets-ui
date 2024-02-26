import { requestPlayer } from 'type/type';
import { GameType, Games, Player, ship, tableKilled } from '../type/Game';
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

  findPlayer(gameId: number, playerId: number) {
    const game = this.findGame(gameId);
    return game.players.find((player) => player.index === playerId);
  }

  findGame(gameId: number) {
    return this.games.find((game) => game.gameId === gameId);
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

  attack(
    matrix: number[][],
    x: number,
    y: number,
    attackedCells: Array<tableKilled>
  ): Array<tableKilled> {
    const offsets = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 0],
    ];

    const neighbours = [];
    for (const offset of offsets) {
      const neighbourX = x + offset[0];
      const neighbourY = y + offset[1];
      if (neighbourX > -1 && neighbourY > -1 && neighbourX < 10 && neighbourY < 10) {
        const lenghtShip = matrix[neighbourY][neighbourX];
        const status = lenghtShip !== 0 ? AttackStatus.Killed : AttackStatus.Miss;
        const result: tableKilled = { x: neighbourX, y: neighbourY, status: status };
        const isResultTableKilled = attackedCells.some(
          (item) => JSON.stringify(item) === JSON.stringify(result)
        );
        if (!isResultTableKilled) {
          neighbours.push({ x: neighbourX, y: neighbourY });
        }
      }
    }
    neighbours.forEach((neighbour) => {
      const lenghtShip = matrix[neighbour.y][neighbour.x];
      const status = lenghtShip !== 0 ? AttackStatus.Killed : AttackStatus.Miss;
      const result: tableKilled = { x: neighbour.x, y: neighbour.y, status: status };
      const isResultTableKilled = attackedCells.some(
        (item) => JSON.stringify(item) === JSON.stringify(result)
      );
      if (!isResultTableKilled) {
        attackedCells.push(result);
      }
      if (lenghtShip !== 0) {
        const newAttackedCells = this.attack(matrix, neighbour.x, neighbour.y, attackedCells);
        attackedCells = [...attackedCells, ...newAttackedCells];
      }
    });

    return attackedCells;
  }

  findSurroundingCells(gameId: number, playerId: number, sunkenCell: Array<number>) {
    const ship = this.findPlayer(gameId, playerId).ships;
    const matrix = this.addShots(ship);
    const [y, x] = sunkenCell;

    const attackedCells = this.attack(matrix, x, y, []);
    attackedCells.forEach((el) => {
      this.replaceElement(gameId, playerId, el.x, el.y);
    });
    return attackedCells;
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

  checkShips(gameId: number, playerId: number, x: number, y: number) {
    const player = this.findPlayer(gameId, playerId);
    return player.shots[y][x];
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

  removePlayerFromGame(playerId: number) {
    const filteredGames = this.games.filter((game) => {
      return !game.players.some((player) => player.index === playerId);
    });

    this.games = filteredGames;
  }
}
export const dbGame = new Game();
