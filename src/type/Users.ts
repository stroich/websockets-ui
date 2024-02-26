export type User = {
  name: string;
  password: string;
  index: number;
  wins: number;
};

export type Users = Array<User>;

export type ResponseUser = {
  type: 'reg';
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  id: 0;
};

export type Winner = {
  name: string;
  wins: number;
};

export type ResponseToWinners = {
  type: 'update_winners';
  data: Array<Winner>;
  id: 0;
};
