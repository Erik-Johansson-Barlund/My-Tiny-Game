// src/map/tileMap.ts
export class TileMap {
  public tileWidth = 40; // Width of one isometric tile (2x height)
  public tileHeight = 20; // Height of one isometric tile

  private images: Record<string, HTMLImageElement>;
  private map: string[][];

  constructor(images: Record<string, HTMLImageElement>) {
    this.images = images;
    this.map = this.generateMap();
  }

  // Generate a 2D array of logical tile keys
  private generateMap(): string[][] {
    const rows = 19;
    const cols = 19;
    const newMap: string[][] = [];

    for (let y = 0; y < rows; y++) {
      const row: string[] = [];
      for (let x = 0; x < cols; x++) {
        let tileKey: string;

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
          // For the inner tiles, randomly choose one of the grass variants
          const grassTiles = ["grass1", "grass2", "grass3"];
          tileKey = grassTiles[Math.floor(Math.random() * grassTiles.length)];
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

        // Calculate the isometric screen position based on grid coordinates
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
