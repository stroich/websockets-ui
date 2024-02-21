import { dbRooms } from 'data/rooms';
import { dbUsers } from '../data/users';
import { ResponseToWinners, ResponseUser } from '../type/Users';
import { User } from '../type/type';
import { stringifyJson } from './stringifyJson';
import { ResponseUpdateRoomType } from 'type/Rooms';

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
        errorText: 'Parsing error',
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