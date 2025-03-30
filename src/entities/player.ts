import { InputManager } from "../core/inputManager";
import { TileMap } from "../map/tileMap";
import { Entity } from "./entity";

export class Player implements Entity {
  gridX: number;
  gridY: number;
  private moveCooldown = 30; // milliseconds between steps
  private lastMoveTime = 0;
  private moveSpeed = 0.16; // speed of player movement

  constructor(gridX: number, gridY: number) {
    this.gridX = gridX;
    this.gridY = gridY;
  }

  isColliding(
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number }
  ): boolean {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  getBounds(): { x: number; y: number; width: number; height: number } {
    return { x: this.gridX, y: this.gridY, width: 1, height: 1 };
  }

  // Computes the minimal translation vector to resolve a collision
  private getCollisionResolution(
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number }
  ): { x: number; y: number } {
    const center1X = rect1.x + rect1.width / 2;
    const center1Y = rect1.y + rect1.height / 2;
    const center2X = rect2.x + rect2.width / 2;
    const center2Y = rect2.y + rect2.height / 2;

    const deltaX = center1X - center2X;
    const deltaY = center1Y - center2Y;
    const combinedHalfWidths = (rect1.width + rect2.width) / 2;
    const combinedHalfHeights = (rect1.height + rect2.height) / 2;

    const overlapX = combinedHalfWidths - Math.abs(deltaX);
    const overlapY = combinedHalfHeights - Math.abs(deltaY);

    if (overlapX < overlapY) {
      return { x: deltaX < 0 ? -overlapX : overlapX, y: 0 };
    } else {
      return { x: 0, y: deltaY < 0 ? -overlapY : overlapY };
    }
  }

  // collidables parameter is optional. When provided, it contains entities (e.g. rocks) to check collisions against.
  update(input: InputManager, map: TileMap, collidables?: Entity[]): void {
    const now = performance.now();
    if (now - this.lastMoveTime < this.moveCooldown) return;

    let deltaX = 0;
    let deltaY = 0;
    if (input.isKeyDown("ArrowUp")) {
      deltaX += -1;
      deltaY += -1;
    }
    if (input.isKeyDown("ArrowDown")) {
      deltaX += 1;
      deltaY += 1;
    }
    if (input.isKeyDown("ArrowLeft")) {
      deltaX += -1;
      deltaY += 1;
    }
    if (input.isKeyDown("ArrowRight")) {
      deltaX += 1;
      deltaY += -1;
    }
    if (deltaX === 0 && deltaY === 0) return;

    // Normalize the intended movement.
    const len = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const normX = deltaX / len;
    const normY = deltaY / len;
    const step = this.moveSpeed;
    const slideFactor = 1 / 3; // When sliding, move slower along the free axis.

    // Define boundaries based on the map dimensions.
    const maxX = map["map"][0].length - 2;
    const maxY = map["map"].length - 2;

    // Compute the full intended movement.
    const fullAttemptX = this.gridX + normX * step;
    const fullAttemptY = this.gridY + normY * step;

    let finalX = this.gridX;
    let finalY = this.gridY;

    // Check horizontal (X) movement independently.
    const testBoundsX = { x: fullAttemptX, y: this.gridY, width: 1, height: 1 };
    let collisionX = false;
    for (const entity of collidables ?? []) {
      if (entity === this) continue;
      if (
        "getBounds" in entity &&
        typeof (entity as any).getBounds === "function"
      ) {
        const otherBounds = (entity as any).getBounds();
        if (this.isColliding(testBoundsX, otherBounds)) {
          collisionX = true;
          break;
        }
      }
    }
    if (!collisionX) {
      finalX = fullAttemptX;
    } else {
      // If X is blocked, we don't update X,
      // and we reduce the Y movement by the slide factor.
      finalX = this.gridX;
    }

    // Now check vertical (Y) movement.
    // If X was blocked, use reduced (sliding) Y movement.
    const attemptedY = collisionX
      ? this.gridY + normY * step * slideFactor
      : fullAttemptY;

    const testBoundsY = { x: finalX, y: attemptedY, width: 1, height: 1 };
    let collisionY = false;
    for (const entity of collidables ?? []) {
      if (entity === this) continue;
      if (
        "getBounds" in entity &&
        typeof (entity as any).getBounds === "function"
      ) {
        const otherBounds = (entity as any).getBounds();
        if (this.isColliding(testBoundsY, otherBounds)) {
          collisionY = true;
          break;
        }
      }
    }
    if (!collisionY) {
      finalY = attemptedY;
    } else {
      // If Y is blocked, keep Y unchanged.
      finalY = this.gridY;
    }

    // Clamp the final position within map boundaries.
    finalX = Math.max(0, Math.min(finalX, maxX));
    finalY = Math.max(0, Math.min(finalY, maxY));

    // Update the player's position.
    this.gridX = finalX;
    this.gridY = finalY;
    this.lastMoveTime = now;
  }

  render(
    ctx: CanvasRenderingContext2D,
    tileWidth: number,
    tileHeight: number
  ): void {
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
