import { InputManager } from "../../core/inputManager";
import { TileMap } from "../../map/tileMap";
import { Entity } from "../entity";
import { Player } from "../player";

export interface DoorTransition {
  targetRoomId: number;
  targetDoorPosition: number;
}

let lastDoorTransitionTime = 0;
const DOOR_TRANSITION_COOLDOWN = 1000;

export class Door implements Entity {
  gridX: number;
  gridY: number;
  width: number = 64;
  height: number = 64;
  image: HTMLImageElement;
  alwaysOnTop: boolean;
  alwaysOnBottom: boolean;
  position: number;
  roomId: number;
  connectionId: number;
  transition: DoorTransition | null = null;
  onPlayerEnter: ((roomId: number, doorPosition: number) => void) | null = null;

  /*
   * positions:
   * 0: upright
   * 1: upleft
   * 2: downright
   * 3: downleft
   */

  constructor(
    gridX: number,
    gridY: number,
    doorImages: HTMLImageElement[],
    position: number = 0,
    roomId: number = 0,
    connectionId: number = 0
  ) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.image = doorImages[position];
    this.alwaysOnTop = position === 2 || position === 3;
    this.alwaysOnBottom = position === 0 || position === 1;
    this.position = position;
    this.roomId = roomId;
    this.connectionId = connectionId;
  }

  setTransition(targetRoomId: number, targetDoorPosition: number): void {
    this.transition = {
      targetRoomId,
      targetDoorPosition,
    };
  }

  update(
    input: InputManager,
    tileMap: TileMap,
    entities?: Entity[],
    delta?: number
  ): void {
    if (entities) {
      const playerEntity = entities.find((e) => e instanceof Player);
      if (playerEntity) {
        const player = playerEntity as Player;
        // Check if the player is adjacent to the door (within 1 grid unit).
        const dx = Math.abs(player.gridX - this.gridX);
        const dy = Math.abs(player.gridY - this.gridY);

        // Check if we can trigger a door transition
        const now = performance.now();
        const canTransition =
          now - lastDoorTransitionTime > DOOR_TRANSITION_COOLDOWN;

        // Increase collision distance to make doors easier to enter
        // If player collides with the door and we have a transition set up
        if (dx <= 0.8 && dy <= 0.8 && this.transition && canTransition) {
          lastDoorTransitionTime = now;

          // Trigger the room transition
          if (this.onPlayerEnter) {
            this.onPlayerEnter(
              this.transition.targetRoomId,
              this.transition.targetDoorPosition
            );
          }
        }
      }
    }
  }

  // Get the opposite door position (for connecting doors)
  getOppositePosition(): number {
    // 0<->3, 1<->2
    switch (this.position) {
      case 0:
        return 3; // upright connects to downleft
      case 1:
        return 2; // upleft connects to downright
      case 2:
        return 1; // downright connects to upleft
      case 3:
        return 0; // downleft connects to upright
      default:
        return 0;
    }
  }

  // Get player spawn position when entering through this door
  getSpawnPosition(): { x: number; y: number } {
    // Place player inside the room from the door, far enough to avoid re-triggering
    let x = this.gridX;
    let y = this.gridY;

    // Adjust based on door position - move player further into the room
    switch (this.position) {
      case 0: // upright - spawn more downward
        x += 0.5;
        y += 1.5;
        break;
      case 1: // upleft - spawn more right
        x += 1.5;
        y += 0;
        break;
      case 2: // downright - spawn more left
        x -= 1.5;
        y -= 0;
        break;
      case 3: // downleft - spawn more up
        x += 0.5;
        y -= 1.5;
        break;
    }

    return { x, y };
  }

  render(ctx: CanvasRenderingContext2D, tileWidth: number, tileHeight: number) {
    let offsetX = 0;
    let offsetY = 0;

    switch (this.position) {
      case 0: // upright
        offsetX = ctx.canvas.width / 2 + 10;
        offsetY = 47;
        break;
      case 1: // upleft
        offsetX = ctx.canvas.width / 2 + 5;
        offsetY = 35;
        break;
      case 2: // downright
        offsetX = ctx.canvas.width / 2 + 5;
        offsetY = 48;
        break;
      case 3: // downleft
        offsetX = ctx.canvas.width / 2;
        offsetY = 49;
        break;
      default:
        offsetX = ctx.canvas.width / 2;
        offsetY = 50;
        break;
    }

    const screenX = offsetX + (this.gridX - this.gridY) * (tileWidth / 2);
    const screenY = offsetY + (this.gridX + this.gridY) * (tileHeight / 2);

    // // draw a red rectangle around the door for debugging
    // ctx.strokeStyle = "red";
    // ctx.strokeRect(
    //   screenX - this.width / 2,
    //   screenY - this.height / 2,
    //   this.width,
    //   this.height
    // );

    ctx.drawImage(
      this.image,
      screenX - this.width / 2,
      screenY - this.height / 2,
      this.width,
      this.height
    );
  }
}
