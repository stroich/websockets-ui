import { User, Users } from 'type/Users';

class DBUsers {
  private readonly users: Users;

  constructor() {
    this.users = [];
  }

  findUser(name: string, password: string): User | undefined {
    for (const user of this.users) {
      if (user.name === name && user.password === password) {
        return user;
      }
    }
    return undefined;
  }

  getUser(index: number): User {
    return this.users.find((user) => user.index === index);
  }

  registerUser(name: string, password: string, id: number) {
    const user = {
      name,
      password,
      index: id,
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
