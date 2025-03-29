import { InputManager } from "../core/inputManager";
import { TileMap } from "../map/tileMap";

export class Player {
  gridX: number;
  gridY: number;
  private moveCooldown = 30; // milliseconds between steps
  private lastMoveTime = 0;
  private moveSpeed = 0.16; // speed of player movement

  constructor(gridX: number, gridY: number) {
    this.gridX = gridX;
    this.gridY = gridY;
  }

  update(input: InputManager, map: TileMap) {
    const now = performance.now();
    if (now - this.lastMoveTime < this.moveCooldown) return;

    let deltaX = 0;
    let deltaY = 0;

    // Apply custom deltas for true cardinal directions
    if (input.isKeyDown("ArrowUp")) {
      // True up: move grid position (-1, -1)
      deltaX += -1;
      deltaY += -1;
    }
    if (input.isKeyDown("ArrowDown")) {
      // True down: move grid position (1, 1)
      deltaX += 1;
      deltaY += 1;
    }
    if (input.isKeyDown("ArrowLeft")) {
      // True left: move grid position (-1, 1)
      deltaX += -1;
      deltaY += 1;
    }
    if (input.isKeyDown("ArrowRight")) {
      // True right: move grid position (1, -1)
      deltaX += 1;
      deltaY += -1;
    }

    if (deltaX !== 0 || deltaY !== 0) {
      // Normalize so that diagonal movement isn't faster
      const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normalizedX = deltaX / length;
      const normalizedY = deltaY / length;

      const stepSize = this.moveSpeed;

      const newGridX = this.gridX + normalizedX * stepSize;
      const newGridY = this.gridY + normalizedY * stepSize;

      const maxY = map["map"].length - 2;
      const maxX = map["map"][0].length - 2;

      if (
        newGridX >= 0 &&
        newGridX <= maxX &&
        newGridY >= 0 &&
        newGridY <= maxY
      ) {
        this.gridX = newGridX;
        this.gridY = newGridY;
        this.lastMoveTime = now;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, tileWidth: number, tileHeight: number) {
    const offsetX = ctx.canvas.width / 2;
    const offsetY = 50;

    const screenX = offsetX + (this.gridX - this.gridY) * (tileWidth / 2);
    const screenY = offsetY + (this.gridX + this.gridY) * (tileHeight / 2);

    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(screenX, screenY + tileHeight / 2, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}
