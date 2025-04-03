// src/entities/entitiesList.ts
import { Entity } from "./entity";
import { InputManager } from "../core/inputManager";
import { TileMap } from "../map/tileMap";
import { Player } from "./player";

export class EntitiesList {
  private entities: Entity[];

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

  update(input: InputManager, tileMap: TileMap, delta: number): void {
    // Pass all entities as collidables to the Player's update.
    for (const entity of this.entities) {
      if (entity instanceof Player) {
        entity.update(input, tileMap, this.entities, delta);
      } else {
        entity.update(input, tileMap);
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
