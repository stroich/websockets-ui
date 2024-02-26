export type RoomType = {
  roomId: number;
  roomUsers: Array<{
    name: string;
    index: number;
  }>;
};

export type RoomsType = Array<RoomType>;

export type ResponseUpdateRoomType = {
  type: 'update_room';
  data: RoomType[];
  id: 0;
};
