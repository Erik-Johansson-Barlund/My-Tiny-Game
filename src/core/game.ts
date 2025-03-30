// src/core/game.ts
import { InputManager } from "./inputManager";
import { TileMap } from "../map/tileMap";
import { EntitiesList } from "../entities/entitiesList";
import { Assets } from "./assets";
import { generateLevel } from "../levelGenerator/levelGenerator";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private lastTime = 0;
  private input = new InputManager();
  private tileMap: TileMap;
  private entities: EntitiesList;
  private assets: Assets;

  constructor(ctx: CanvasRenderingContext2D, assets: Assets) {
    this.ctx = ctx;
    this.assets = assets;

    // Generate the level, which creates both a tileMap and an EntitiesList with dynamic content.
    const { tileMap, entities } = generateLevel(assets);
    this.tileMap = tileMap;
    this.entities = entities;

    window.addEventListener("keydown", (e) => this.input.keyDown(e));
    window.addEventListener("keyup", (e) => this.input.keyUp(e));
  }

  start() {
    requestAnimationFrame((time) => this.loop(time));
  }

  loop(timestamp: number) {
    const delta = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this.update(delta);
    this.render();

    requestAnimationFrame((time) => this.loop(time));
  }

  update(delta: number) {
    // Update all entities (player, rocks, etc.) dynamically generated in the level.
    this.entities.update(this.input, this.tileMap);
  }

  render() {
    this.ctx.clearRect(0, 0, 800, 600);
    this.tileMap.render(this.ctx);
    // Render all entities on top of the tile map
    this.entities.render(
      this.ctx,
      this.tileMap.tileWidth,
      this.tileMap.tileHeight
    );
  }
}
