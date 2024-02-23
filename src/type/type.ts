import { WebSocket } from 'ws';
import { ship } from './Game';

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
