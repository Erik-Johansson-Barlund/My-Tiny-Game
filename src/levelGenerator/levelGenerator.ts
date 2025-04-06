import { Assets } from "../core/assets";
import { Door } from "../entities/doors/door";
import { EntitiesList } from "../entities/entitiesList";
import { Rock } from "../entities/obstacles/rock";
import { Player } from "../entities/player";
import { TileMap } from "../map/tileMap";
import { generateLayout } from "./generateLayout";

interface Room {
  id: number;
  tileMap: TileMap;
  entities: EntitiesList;
  doors: Door[];
}

const DOOR_POSITIONS = {
  UPRIGHT: 0,
  UPLEFT: 1,
  DOWNRIGHT: 2,
  DOWNLEFT: 3,
};

let currentRoomId = 0;
const rooms = new Map<number, Room>();
let player: Player | null = null;

type RoomChangeCallback = (newRoom: {
  tileMap: TileMap;
  entities: EntitiesList;
}) => void;
const roomChangeCallbacks: RoomChangeCallback[] = [];

// Subscribe to room change events
export function subscribeToRoomChange(callback: RoomChangeCallback): void {
  roomChangeCallbacks.push(callback);
}

// Get the current room
export function getCurrentRoom(): Room | null {
  return rooms.get(currentRoomId) || null;
}

// Function to change rooms when a player enters a door
function changeRoom(targetRoomId: number, targetDoorPosition: number): void {
  if (!player || !rooms.has(targetRoomId)) return;

  // Remove player from current room's entities
  const currentRoom = rooms.get(currentRoomId)!;
  currentRoom.entities.entities = currentRoom.entities.entities.filter(
    (e) => !(e instanceof Player)
  );

  // Set the current room id
  currentRoomId = targetRoomId;

  // Find the target door in the new room
  const newRoom = rooms.get(targetRoomId)!;
  const targetDoor = newRoom.doors.find(
    (door) => door.position === targetDoorPosition
  );
  if (!targetDoor) return;

  // Get the spawn position from the door and update the player's grid position
  const spawnPos = targetDoor.getSpawnPosition();
  player.gridX = spawnPos.x;
  player.gridY = spawnPos.y;

  // Add player to the new room's entities
  newRoom.entities.addEntity(player);

  // Notify subscribers about the room change
  for (const callback of roomChangeCallbacks) {
    callback({
      tileMap: newRoom.tileMap,
      entities: newRoom.entities,
    });
  }
}

// Generate a single room with doors
function generateRoom(
  roomId: number,
  assets: Assets,
  doorPositions: number[]
): Room {
  const tileMap = new TileMap(assets.tiles, doorPositions);

  const entities = new EntitiesList([]);

  const doors: Door[] = [];
  const doorImgs = [
    assets.doors.door_upright,
    assets.doors.door_upleft,
    assets.doors.door_downright,
    assets.doors.door_downleft,
  ];

  doorPositions.forEach((position) => {
    let x = 9;
    let y = 9;
    // Position the door based on its type
    switch (position) {
      case DOOR_POSITIONS.UPRIGHT:
        x = 9;
        y = 0;
        break;
      case DOOR_POSITIONS.UPLEFT:
        x = 0;
        y = 9;
        break;
      case DOOR_POSITIONS.DOWNRIGHT:
        x = 18;
        y = 9;
        break;
      case DOOR_POSITIONS.DOWNLEFT:
        x = 9;
        y = 18;
        break;
    }

    // Create the door; note we pass roomId so the door knows which room it belongs to.
    const door = new Door(x, y, doorImgs, position, roomId);

    // Set up the door transition callback
    door.onPlayerEnter = changeRoom;

    doors.push(door);
    entities.addEntity(door);
  });

  const rocks = [];
  const rockCount = Math.floor(Math.random() * 3); // 0 - 3 rocks per room
  for (let i = 0; i < rockCount; i++) {
    let x, y;
    let validPosition = false;
    while (!validPosition) {
      x = 2 + Math.floor(Math.random() * 17);
      y = 2 + Math.floor(Math.random() * 17);
      validPosition = true;
      if (Math.abs(x - 9) < 3 && Math.abs(y - 9) < 3) {
        validPosition = false;
        continue;
      }
      for (const door of doors) {
        if (Math.abs(x - door.gridX) < 3 && Math.abs(y - door.gridY) < 3) {
          validPosition = false;
          break;
        }
      }
    }

    const rock = new Rock(x!, y!, [assets.rocks.rock1]);
    rocks.push(rock);
  }
  if (rocks.length > 0) {
    entities.addEntity(rocks);
  }

  return { id: roomId, tileMap, entities, doors };
}

// Function to connect two doors for transitions
function connectDoors(doorA: Door, doorB: Door): void {
  doorA.setTransition(doorB.roomId, doorB.position);
  doorB.setTransition(doorA.roomId, doorA.position);
}

// Helper function to get the opposite door position
function getOppositeDoorPosition(position: number): number {
  switch (position) {
    case DOOR_POSITIONS.UPRIGHT:
      return DOOR_POSITIONS.DOWNLEFT;
    case DOOR_POSITIONS.UPLEFT:
      return DOOR_POSITIONS.DOWNRIGHT;
    case DOOR_POSITIONS.DOWNRIGHT:
      return DOOR_POSITIONS.UPLEFT;
    case DOOR_POSITIONS.DOWNLEFT:
      return DOOR_POSITIONS.UPRIGHT;
    default:
      return 0;
  }
}

export function generateLevelNew(assets: Assets): {
  tileMap: TileMap;
  entities: EntitiesList;
  miniMap: number[][];
} {
  const { layout, map } = generateLayout(10);
  rooms.clear();
  player = new Player(9, 9, assets.player);

  for (const roomData of layout) {
    const doorPositions = roomData.doors.map((d) => d.door);
    const generatedRoom = generateRoom(roomData.id, assets, doorPositions);
    rooms.set(roomData.id, generatedRoom);
    // Place the player in room with id 1 as starting room.
    if (roomData.id === 1) {
      generatedRoom.entities.addEntity(player);
      currentRoomId = 1;
    }
  }

  // connect rooms according to the layout's door connections.
  for (const roomData of layout) {
    const currentRoom = rooms.get(roomData.id);
    if (!currentRoom) continue;

    for (const doorData of roomData.doors) {
      const connectedRoom = rooms.get(doorData.connection);
      if (!connectedRoom) continue;
      // Find the door in the current room corresponding to doorData.door.
      const doorA = currentRoom.doors.find((d) => d.position === doorData.door);
      // The corresponding door in the connected room should be at the opposite position.
      const oppositePos = getOppositeDoorPosition(doorData.door);
      const doorB = connectedRoom.doors.find((d) => d.position === oppositePos);
      if (doorA && doorB) {
        connectDoors(doorA, doorB);
      }
    }
  }

  return {
    tileMap: rooms.get(currentRoomId)!.tileMap,
    entities: rooms.get(currentRoomId)!.entities,
    miniMap: map,
  };
}
