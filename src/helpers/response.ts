import { dbRooms } from 'data/rooms';
import { dbUsers } from '../data/users';
import { ResponseToWinners, ResponseUser } from '../type/Users';
import { User } from '../type/Users';
import { stringifyJson } from './stringifyJson';
import { ResponseUpdateRoomType } from 'type/Rooms';
import { ResponseCreateGame, ResponseTurn, ResponseAttack, ResponseFinish } from 'type/type';
import { GameType } from 'type/Game';
import { AttackStatus } from 'type/enums';

export function createResponseToRegistration(name: string | undefined, user: User) {
  if (name) {
    const responseToRegistration: ResponseUser = {
      type: 'reg',
      data: {
        name,
        index: user.index,
        error: false,
        errorText: '',
      },
      id: 0,
    };
    return stringifyJson(responseToRegistration);
  } else {
    const responseToRegistration: ResponseUser = {
      type: 'reg',
      data: {
        name: null,
        index: null,
        error: true,
        errorText: 'The client is already logged in',
      },
      id: 0,
    };
    return stringifyJson(responseToRegistration);
  }
}

export function createResponseToWinners() {
  const winners = dbUsers.getAllWinners();
  const responseToWinners: ResponseToWinners = {
    type: 'update_winners',
    data: winners,
    id: 0,
  };
  return stringifyJson(responseToWinners);
}

export function createResponseToUpdateRoom() {
  const rooms = dbRooms.getAllRooms();
  const responseToUpdateRoom: ResponseUpdateRoomType = {
    type: 'update_room',
    data: rooms,
    id: 0,
  };
  return stringifyJson(responseToUpdateRoom);
}

export function createGame(idGame: number, idPlayer: number) {
  const responseToUpdateRoom: ResponseCreateGame = {
    type: 'create_game',
    data: {
      idGame: idGame,
      idPlayer: idPlayer,
    },
    id: 0,
  };
  return stringifyJson(responseToUpdateRoom);
}

export function startGame(game: GameType) {
  const players = game.players;
  return players.map((el) => {
    const response = {
      type: 'start_game',
      data: {
        ships: el.ships,
        currentPlayerIndex: el.index,
      },
      id: 0,
    };
    return {
      playerId: el.index,
      response: stringifyJson(response),
    };
  });
}

export function updateTurn(playerId: number) {
  const responseToUpdateTurn: ResponseTurn = {
    type: 'turn',
    data: {
      currentPlayer: playerId,
    },
    id: 0,
  };
  return stringifyJson(responseToUpdateTurn);
}

export function createResponseToAttack(
  x: number,
  y: number,
  status: AttackStatus,
  playerId: number
) {
  const responseAttack: ResponseAttack = {
    type: 'attack',
    data: {
      position: {
        x: x,
        y: y,
      },
      currentPlayer: playerId,
      status: status,
    },
    id: 0,
  };
  return stringifyJson(responseAttack);
}

export function createResponseToFinish(playerId: number) {
  const responseFinish: ResponseFinish = {
    type: 'finish',
    data: {
      winPlayer: playerId,
    },
    id: 0,
  };
  return stringifyJson(responseFinish);
}
