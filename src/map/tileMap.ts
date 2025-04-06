// src/map/tileMap.ts
export class TileMap {
  public tileWidth = 40; // Width of one isometric tile (2x height)
  public tileHeight = 20; // Height of one isometric tile

  private images: Record<string, HTMLImageElement>;
  private map: string[][];
  private doors: number[];

  constructor(images: Record<string, HTMLImageElement>, doors: number[]) {
    this.images = images;
    this.doors = doors; // door indices, e.g. [0, 2] for only doors 0 and 2
    this.map = this.generateMap();
  }

  // Generate a 2D array of logical tile keys
  private generateMap(): string[][] {
    const rows = 20;
    const cols = 20;
    const newMap: string[][] = [];

    // Define the center and full door positions.
    const center = { x: Math.floor(cols / 2), y: Math.floor(rows / 2) - 1 }; // for 20x20, center = (9,9)
    const fullDoorPositions = [
      { x: 9, y: 0 }, // door 0: upright
      { x: 0, y: 8 }, // door 1: upleft
      { x: 18, y: 9 }, // door 2: downright
      { x: 9, y: 18 }, // door 3: downleft
    ];

    // Filter door positions based on the provided door indices.
    const activeDoorPositions = this.doors?.map(
      (doorIndex) => fullDoorPositions[doorIndex]
    );

    for (let y = 0; y < rows; y++) {
      const row: string[] = [];
      for (let x = 0; x < cols; x++) {
        let tileKey: string;

        // Edge conditions.
        const isTopLeftEdge = y === rows - 1 && x === 0;
        const isTopRightEdge = y === 0 && x === cols - 1;
        const isLeftEdge = y === rows - 1;
        const isRightEdge = x === cols - 1;
        const isCenterEdge = y === rows - 1 && x === cols - 1;

        if (isTopLeftEdge) {
          tileKey = "edgeTopLeft";
        } else if (isTopRightEdge) {
          tileKey = "edgeTopRight";
        } else if (isCenterEdge) {
          tileKey = "edgeCenter";
        } else if (isLeftEdge) {
          tileKey = "edgeLeft";
        } else if (isRightEdge) {
          tileKey = "edgeRight";
        } else {
          // For inner tiles, choose from the grass variants.
          // We now use two variants and a special "preferred" grass for door paths.
          const grassTiles = ["grass1", "grass2"];
          let isDoorPath = false;

          // Only consider door paths if we have active door positions.
          for (const doorPos of activeDoorPositions) {
            const minX = Math.min(center.x, doorPos.x);
            const maxX = Math.max(center.x, doorPos.x);
            const minY = Math.min(center.y, doorPos.y);
            const maxY = Math.max(center.y, doorPos.y);
            if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
              isDoorPath = true;
              break;
            }
          }

          if (isDoorPath) {
            // 90% chance to choose the preferred grass tile.
            tileKey =
              Math.random() < 0.9
                ? "grass3"
                : grassTiles[Math.floor(Math.random() * grassTiles.length)];
          } else {
            tileKey = grassTiles[Math.floor(Math.random() * grassTiles.length)];
          }
        }
        row.push(tileKey);
      }
      newMap.push(row);
    }

    return newMap;
  }

  render(ctx: CanvasRenderingContext2D) {
    const offsetX = ctx.canvas.width / 2;
    const offsetY = 50;

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const tileKey = this.map[y][x];
        const tileImg = this.images[tileKey];

        if (!tileImg) continue;

        // Calculate the isometric screen position based on grid coordinates.
        const screenX = offsetX + (x - y) * (this.tileWidth / 2);
        const screenY = offsetY + (x + y) * (this.tileHeight / 2);

        ctx.drawImage(
          tileImg,
          screenX - this.tileWidth / 2,
          screenY,
          this.tileWidth,
          this.tileHeight
        );
      }
    }
  }
}
