import { InputManager } from "../core/inputManager";
import { TileMap } from "../map/tileMap";
import { Entity } from "./entity";
import { SpriteAnimation } from "../core/spriteAnimation";

type Direction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "upleft"
  | "upright"
  | "downleft"
  | "downright";

export class Player implements Entity {
  gridX: number;
  gridY: number;
  private moveCooldown = 30; // milliseconds between steps
  private lastMoveTime = 0;
  private moveSpeed = 0.16; // movement step size
  private zoom: number = 1.5;

  private animations: Record<Direction, SpriteAnimation>;
  private currentDirection: Direction = "down"; // default direction
  private currentAnimation: SpriteAnimation;

  constructor(
    gridX: number,
    gridY: number,
    playerImages: Record<string, HTMLImageElement>
  ) {
    this.gridX = gridX;
    this.gridY = gridY;

    // Set the dimensions and frame data—adjust if needed.
    const frameWidth = 32;
    const frameHeight = 32;
    const frameCount = 4; // number of frames in the sprite sheet
    const frameRate = 6; // frames per second animation speed

    // Create animations for each direction using the corresponding image.
    this.animations = {
      up: new SpriteAnimation(
        playerImages["player_up"],
        frameWidth,
        frameHeight,
        frameCount,
        frameRate
      ),
      down: new SpriteAnimation(
        playerImages["player_down"],
        frameWidth,
        frameHeight,
        frameCount,
        frameRate
      ),
      left: new SpriteAnimation(
        playerImages["player_left"],
        frameWidth,
        frameHeight,
        frameCount,
        frameRate
      ),
      right: new SpriteAnimation(
        playerImages["player_right"],
        frameWidth,
        frameHeight,
        frameCount,
        frameRate
      ),
      upleft: new SpriteAnimation(
        playerImages["player_upleft"],
        frameWidth,
        frameHeight,
        frameCount,
        frameRate
      ),
      upright: new SpriteAnimation(
        playerImages["player_upright"],
        frameWidth,
        frameHeight,
        frameCount,
        frameRate
      ),
      downleft: new SpriteAnimation(
        playerImages["player_downleft"],
        frameWidth,
        frameHeight,
        frameCount,
        frameRate
      ),
      downright: new SpriteAnimation(
        playerImages["player_downright"],
        frameWidth,
        frameHeight,
        frameCount,
        frameRate
      ),
    };

    // Set the default active animation.
    this.currentAnimation = this.animations[this.currentDirection];
  }

  update(
    input: InputManager,
    map: TileMap,
    collidables?: Entity[],
    delta?: number
  ): void {
    // Determine the new direction based on input.
    let newDirection: Direction | null = null;
    if (input.isKeyDown("ArrowUp") && input.isKeyDown("ArrowLeft")) {
      newDirection = "upleft";
    } else if (input.isKeyDown("ArrowUp") && input.isKeyDown("ArrowRight")) {
      newDirection = "upright";
    } else if (input.isKeyDown("ArrowDown") && input.isKeyDown("ArrowLeft")) {
      newDirection = "downleft";
    } else if (input.isKeyDown("ArrowDown") && input.isKeyDown("ArrowRight")) {
      newDirection = "downright";
    } else if (input.isKeyDown("ArrowUp")) {
      newDirection = "up";
    } else if (input.isKeyDown("ArrowDown")) {
      newDirection = "down";
    } else if (input.isKeyDown("ArrowLeft")) {
      newDirection = "left";
    } else if (input.isKeyDown("ArrowRight")) {
      newDirection = "right";
    }

    if (newDirection && newDirection !== this.currentDirection) {
      this.currentDirection = newDirection;
      this.currentAnimation = this.animations[this.currentDirection];
    }

    // Check if any movement key is pressed.
    const isMoving =
      input.isKeyDown("ArrowUp") ||
      input.isKeyDown("ArrowDown") ||
      input.isKeyDown("ArrowLeft") ||
      input.isKeyDown("ArrowRight");

    // Update the animation only if moving, otherwise lock to idle (frame 0).
    if (delta !== undefined) {
      if (isMoving) {
        this.currentAnimation.update(delta);
      } else {
        // Reset to idle state: first frame, no elapsed time.
        this.currentAnimation.currentFrame = 0;
        this.currentAnimation.elapsedTime = 0;
      }
    }

    // Continue with your movement logic...
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

    const len = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const normX = deltaX / len;
    const normY = deltaY / len;
    const step = this.moveSpeed;
    const slideFactor = 1 / 3;

    const maxX = map["map"][0].length - 2;
    const maxY = map["map"].length - 2;
    const fullAttemptX = this.gridX + normX * step;
    const fullAttemptY = this.gridY + normY * step;

    let finalX = this.gridX;
    let finalY = this.gridY;

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
    }

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
    }

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

    // // draw a yellow rectangle for debugging
    // ctx.strokeStyle = "yellow";
    // ctx.strokeRect(
    //   screenX - this.currentAnimation.frameWidth / 2,
    //   screenY - this.currentAnimation.frameHeight / 2,
    //   this.currentAnimation.frameWidth,
    //   this.currentAnimation.frameHeight
    // );

    ctx.save();
    // Draw the current frame of the active animation.
    const scaledWidth = this.currentAnimation.frameWidth + 15; // Adjusted for zoom
    const scaledHeight = this.currentAnimation.frameHeight + 5; // Adjusted for zoom

    const drawX = screenX - scaledWidth / 2;
    const drawY = screenY + tileHeight / 2 - scaledHeight;
    this.currentAnimation.draw(ctx, drawX, drawY, this.zoom);

    ctx.restore();
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
}
