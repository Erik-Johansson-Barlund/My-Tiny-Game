import { Entity } from "./entity";
import { InputManager } from "../core/inputManager";
import { TileMap } from "../map/tileMap";
import { Player } from "./player";

export class EntitiesList {
  public entities: Entity[];

  constructor(initialEntities: Entity[] = []) {
    this.entities = initialEntities;
  }

  addEntity(entity: Entity | Entity[]) {
    if (Array.isArray(entity)) {
      this.entities.push(...entity);
    } else {
      this.entities.push(entity);
    }
  }

  getEntities(): Entity[] {
    return this.entities;
  }

  update(input: InputManager, tileMap: TileMap, delta: number): void {
    // Pass all entities as collidables to the Player's update.
    for (const entity of this.entities) {
      if (entity instanceof Player) {
        entity.update(input, tileMap, this.entities, delta);
      } else {
        entity.update(input, tileMap, this.entities);
      }
    }
  }

  render(
    ctx: CanvasRenderingContext2D,
    tileWidth: number,
    tileHeight: number
  ): void {
    // Sort entities by their depth (here using gridX + gridY)
    this.entities.sort((a, b) => {
      // If one entity is alwaysOnTop and the other isn't, alwaysOnTop comes later (rendered last)
      if (a.alwaysOnTop && !b.alwaysOnTop) return 1;
      if (!a.alwaysOnTop && b.alwaysOnTop) return -1;

      // If one entity is alwaysOnBottom and the other isn't, alwaysOnBottom comes first (rendered first)
      if (a.alwaysOnBottom && !b.alwaysOnBottom) return -1;
      if (!a.alwaysOnBottom && b.alwaysOnBottom) return 1;

      // Otherwise, sort by depth (gridX + gridY)
      const depthA = (a as any).gridX + (a as any).gridY;
      const depthB = (b as any).gridX + (b as any).gridY;
      return depthA - depthB;
    });

    // Render in sorted order
    this.entities.forEach((entity) => {
      entity.render(ctx, tileWidth, tileHeight);
    });
  }
}
