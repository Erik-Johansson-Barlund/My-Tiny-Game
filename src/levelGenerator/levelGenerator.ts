import { Assets } from "../core/assets";
import { EntitiesList } from "../entities/entitiesList";
import { Rock } from "../entities/obstacles/rock";
import { Player } from "../entities/player";
import { TileMap } from "../map/tileMap";

export function generateLevel(assets: Assets): {
  tileMap: TileMap;
  entities: EntitiesList;
} {
  // Generate a new tile map for the level
  const tileMap = new TileMap(assets.tiles);

  // Create a new entities list for the level
  const entities = new EntitiesList([new Player(9, 9, assets.player)]);

  const rocks = [];
  for (let y = 0; y < 18; y++) {
    for (let x = 0; x < 18; x++) {
      if (Math.random() < 0.02) {
        // 10% chance to create a rock at this cell
        const rock = new Rock(x, y, Object.values(assets.rocks));
        rocks.push(rock);
      }
    }
  }

  // For now we just add some rocks to the level
  entities.addEntity(rocks);

  return { tileMap, entities };
}
