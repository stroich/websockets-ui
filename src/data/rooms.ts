import { RoomsType } from '../type/Rooms';

class Rooms {
  private rooms: RoomsType;
  constructor() {
    this.rooms = [];
  }

  getAllRooms() {
    return this.rooms;
  }

  createRoom() {
    const roomId = Date.now();
    this.rooms.push({
      roomId,
      roomUsers: [],
    });

    return roomId;
  }

  findRoom(roomId: number) {
    return this.rooms.find((room) => room.roomId === roomId);
  }

  updateRoom(roomId: number, userId: number, name: string): boolean {
    const roomIndex = this.rooms.findIndex((room) => room.roomId === roomId);
    if (roomIndex === -1) {
      return;
    }
    const isUser = this.rooms[roomIndex].roomUsers.findIndex((user) => user.index === userId);
    if (isUser === -1) {
      const newUserInTheRoom = {
        name,
        index: userId,
      };

      this.rooms[roomIndex].roomUsers.push(newUserInTheRoom);
      return true;
    } else {
      return false;
    }
  }

  deleteRoom(roomId: number) {
    const roomIndex = this.rooms.findIndex((room) => room.roomId === roomId);

    if (roomIndex === -1) {
      return;
    }

    this.rooms.splice(roomIndex, 1);
  }

  deleteRoomWithCertainUser(userId: number) {
    const filteredRooms = this.rooms.filter((room) => {
      return !room.roomUsers.some((user) => user.index === userId);
    });

    this.rooms = filteredRooms;
  }
}

export const dbRooms = new Rooms();
