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
  shots: Array<ship>;
};

export type GameType = {
  gameId: number;
  players: Array<Player>;
};

export type Games = Array<GameType>;
