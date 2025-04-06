import { InputManager } from "../core/inputManager";
import { TileMap } from "../map/tileMap";

export interface Entity {
  update(
    input: InputManager,
    tileMap: TileMap,
    entities?: Entity[],
    delta?: number
  ): void;

  alwaysOnTop?: boolean;
  alwaysOnBottom?: boolean;

  render(
    ctx: CanvasRenderingContext2D,
    tileWidth: number,
    tileHeight: number
  ): void;
}
