import { InputManager } from "./inputManager";
import { Player } from "../entities/player";
import { TileMap } from "../map/tileMap";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private lastTime = 0;
  private input = new InputManager();
  private player = new Player(9, 9);
  private tileMap: TileMap;

  constructor(ctx: CanvasRenderingContext2D, tileMap: TileMap) {
    this.ctx = ctx;

    this.tileMap = tileMap;
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
    this.player.update(this.input, this.tileMap); // pass tileMap if you want to check for walls
    this.player.render(
      this.ctx,
      this.tileMap.tileWidth,
      this.tileMap.tileHeight
    );
  }

  render() {
    this.ctx.clearRect(0, 0, 800, 600);
    this.tileMap.render(this.ctx);
    this.player.render(
      this.ctx,
      this.tileMap.tileWidth,
      this.tileMap.tileHeight
    );
  }
}
