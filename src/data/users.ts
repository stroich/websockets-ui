import { Users } from 'type/type';

class DBUsers {
  private readonly users: Users;

  constructor() {
    this.users = [];
  }

  getUser(index: number) {
    return this.users.find((user) => user.index === index);
  }

  registerUser(name: string, password: string) {
    const user = {
      name,
      password,
      index: Date.now(),
      wins: 0,
    };

    this.users.push(user);
    return user;
  }

  addWinner(id: number) {
    const user = this.getUser(id);
    user.wins = user.wins + 1;
  }

  getAllUsers() {
    return this.users;
  }

  getAllWinners() {
    const users = this.users;
    return users
      .filter((item) => item.wins > 0)
      .map((item) => ({
        name: item.name,
        wins: item.wins,
      }));
  }
}

export const dbUsers = new DBUsers();
