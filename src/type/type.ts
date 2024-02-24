import { WebSocket } from 'ws';
import { ship } from './Game';
import { AttackStatus } from './enums';

export interface BSWebSocket extends WebSocket {
  id: number;
}

export interface MessageJson {
  type: string;
  data: any;
  id: number;
}

export type ResponseCreateGame = {
  type: 'create_game';
  data: {
    idGame: number;
    idPlayer: number;
  };
  id: 0;
};

export type ResponseStartGame = {
  type: 'start_game';
  data: {
    ships: Array<ship>;
    currentPlayerIndex: number;
  };
  id: 0;
};

export type ResponseTurn = {
  type: 'turn';
  data: {
    currentPlayer: number;
  };
  id: 0;
};

export type ResponseAttack = {
  type: 'attack';
  data: {
    position: {
      x: number;
      y: number;
    };
    currentPlayer: number;
    status: AttackStatus;
  };
  id: 0;
};

export type requestPlayer = {
  gameId: number;
  ships: [
    {
      position: {
        x: number;
        y: number;
      };
      direction: boolean;
      length: number;
      type: 'small' | 'medium' | 'large' | 'huge';
    },
  ];
  indexPlayer: number;
};

export type RequestAddShips = {
  type: 'add_ships';
  data: requestPlayer;
  id: 0;
};

export type RequestAttack = {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
};

export type ResponseFinish = {
  type: 'finish';
  data: {
    winPlayer: number;
  };
  id: 0;
};

export type RequestRandomAttack = {
  type: 'randomAttack';
  data: {
    gameId: number;
    indexPlayer: number;
  };
  id: 0;
};
