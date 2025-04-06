import { InputManager } from "./inputManager";
import { TileMap } from "../map/tileMap";
import { EntitiesList } from "../entities/entitiesList";
import { Assets } from "./assets";
import {
  getCurrentRoom,
  subscribeToRoomChange,
  generateLevelNew,
} from "../levelGenerator/levelGenerator";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private lastTime = 0;
  private input = new InputManager();
  private tileMap: TileMap;
  private miniMap: number[][] = [];
  private entities: EntitiesList;
  private assets: Assets;
  private transitionEffect = {
    active: false,
    alpha: 0,
    fadingIn: true,
    duration: 300, // milliseconds
    startTime: 0,
  };

  constructor(ctx: CanvasRenderingContext2D, assets: Assets) {
    this.ctx = ctx;
    this.assets = assets;

    const { tileMap, entities, miniMap } = generateLevelNew(assets);
    this.tileMap = tileMap;
    this.entities = entities;
    this.miniMap = miniMap;

    // Subscribe to room change events
    subscribeToRoomChange((newRoom) => {
      this.handleRoomChange(newRoom);
    });

    window.addEventListener("keydown", (e) => this.input.keyDown(e));
    window.addEventListener("keyup", (e) => this.input.keyUp(e));
  }

  // Handle room transitions
  handleRoomChange(newRoom: { tileMap: TileMap; entities: EntitiesList }) {
    // Start fade out transition
    this.transitionEffect.active = true;
    this.transitionEffect.fadingIn = false;
    this.transitionEffect.alpha = 0;
    this.transitionEffect.startTime = performance.now();

    // Schedule the actual room change halfway through the transition
    setTimeout(() => {
      // Update the game state with the new room
      this.tileMap = newRoom.tileMap;
      this.entities = newRoom.entities;

      // Start fade in
      this.transitionEffect.fadingIn = true;
    }, this.transitionEffect.duration / 2);
  }

  start() {
    requestAnimationFrame((time) => this.loop(time));
  }

  loop(timestamp: number) {
    const delta = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this.update(delta, timestamp);
    this.render();

    requestAnimationFrame((time) => this.loop(time));
  }

  update(delta: number, timestamp: number) {
    // Update transition effect if active
    if (this.transitionEffect.active) {
      const elapsed = timestamp - this.transitionEffect.startTime;
      const progress = Math.min(elapsed / this.transitionEffect.duration, 1);

      if (this.transitionEffect.fadingIn) {
        // Fading in (1.0 -> 0.0)
        this.transitionEffect.alpha = 1.0 - progress;
        if (progress >= 1) {
          this.transitionEffect.active = false;
        }
      } else {
        // Fading out (0.0 -> 1.0)
        this.transitionEffect.alpha = progress;
      }
    }

    // Only update game logic if we're not mid-transition
    if (!this.transitionEffect.active || this.transitionEffect.alpha < 0.9) {
      // Update all entities (player, rocks, etc.) dynamically generated in the level.
      this.entities.update(this.input, this.tileMap, delta);
    }

    // Check if room has changed
    const currentRoom = getCurrentRoom();
    if (
      currentRoom &&
      (this.tileMap !== currentRoom.tileMap ||
        this.entities !== currentRoom.entities)
    ) {
      this.tileMap = currentRoom.tileMap;
      this.entities = currentRoom.entities;
    }
  }

  renderMiniMap() {
    const miniMapWidth = 100;
    const miniMapHeight = 100;
    const tileSize = Math.min(
      miniMapWidth / this.miniMap[0].length,
      miniMapHeight / this.miniMap.length
    );

    const isoTileWidth = tileSize * 2;
    const isoTileHeight = tileSize;

    const offsetX = this.ctx.canvas.width - miniMapWidth;
    const offsetY = 40;

    // Draw the mini-map in isometric perspective
    for (let y = 0; y < this.miniMap.length; y++) {
      for (let x = 0; x < this.miniMap[y].length; x++) {
        const tileKey = this.miniMap[y][x];
        let color = "black";
        if (tileKey === 0) {
          color = "#2e2d2d";
        }
        if (getCurrentRoom()?.id === tileKey) {
          // Highlight the current room
          color = "gray";
        }

        const isoX = (x - y) * (isoTileWidth / 2) + offsetX;
        const isoY = (x + y) * (isoTileHeight / 2) + offsetY;

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(isoX, isoY);
        this.ctx.lineTo(isoX + isoTileWidth / 2, isoY + isoTileHeight / 2);
        this.ctx.lineTo(isoX, isoY + isoTileHeight);
        this.ctx.lineTo(isoX - isoTileWidth / 2, isoY + isoTileHeight / 2);
        this.ctx.closePath();
        this.ctx.fill();
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.tileMap.render(this.ctx);

    this.entities.render(
      this.ctx,
      this.tileMap.tileWidth,
      this.tileMap.tileHeight
    );

    this.renderMiniMap();

    if (this.transitionEffect.active) {
      this.ctx.fillStyle = `rgba(0, 0, 0, ${this.transitionEffect.alpha})`;
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
  }
}
