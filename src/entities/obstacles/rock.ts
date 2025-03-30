import { InputManager } from "../../core/inputManager";
import { TileMap } from "../../map/tileMap";
import { CollidableEntity } from "../collidableEntity";

export class Rock implements CollidableEntity {
  gridX: number;
  gridY: number;
  tileWidth: number = 32;
  tileHeight: number = 32;
  image: HTMLImageElement;

  constructor(gridX: number, gridY: number, rockImages: HTMLImageElement[]) {
    this.gridX = gridX;
    this.gridY = gridY;
    const randomIndex = Math.floor(Math.random() * rockImages.length);
    this.image = rockImages[randomIndex];
  }

  update(input: InputManager, tileMap: TileMap) {
    // Rocks might not update much, but implement any behavior if needed.
  }

  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.gridX,
      y: this.gridY,
      width: 0.5,
      height: 0.5,
    };
  }

  render(ctx: CanvasRenderingContext2D, tileWidth: number, tileHeight: number) {
    const offsetX = ctx.canvas.width / 2;
    const offsetY = 50;

    const screenX = offsetX + (this.gridX - this.gridY) * (tileWidth / 2);
    const screenY = offsetY + (this.gridX + this.gridY) * (tileHeight / 2);

    ctx.drawImage(
      this.image,
      screenX - this.tileWidth / 2,
      screenY - this.tileHeight / 2,
      this.tileWidth,
      this.tileHeight
    );
  }
}
