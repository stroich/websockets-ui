import { AttackStatus } from './enums';

export type ship = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};

export type Player = {
  index: number;
  ships: Array<ship>;
  shots: Array<number[]>;
};

export type GameType = {
  gameId: number;
  players: Array<Player>;
};

export type Games = Array<GameType>;

export type HitCoordinates = {
  x: number;
  y: number;
};

export type tableKilled = {
  x: number;
  y: number;
  status: AttackStatus;
};
