import { ResponseUser } from '../type/Users';
import { User } from '../type/type';
import { stringifyJson } from './stringifyJson';

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
