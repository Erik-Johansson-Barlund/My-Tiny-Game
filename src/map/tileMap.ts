export class TileMap {
  public tileWidth = 40; // Width of one isometric tile (2x height)
  public tileHeight = 20; // Height of one isometric tile

  private images: Record<number, HTMLImageElement>;

  constructor(images: Record<number, HTMLImageElement>) {
    this.images = images;
    this.map = this.generateMap();
  }

  // private map: number[][] = [];

  private generateMap(): number[][] {
    const rows = 19;
    const cols = 19;
    const newMap: number[][] = [];

    for (let y = 0; y < rows; y++) {
      const row: number[] = [];
      for (let x = 0; x < cols; x++) {
        const isOuterBorder =
          y === 0 || y === rows - 1 || x === 0 || x === cols - 1;

        const isTopLeftEdge = y === 18 && x === 0;
        const isTopRightEdge = y === 0 && x === 18;

        const isLeftEdge = y === 18;
        const isRightEdge = x === 18;
        const isCenterEdge = y === 18 && x === 18;

        let tileType;
        switch (true) {
          case isTopLeftEdge:
            tileType = 5;
            break;
          case isTopRightEdge:
            tileType = 7;
            break;
          case isCenterEdge:
            tileType = 8;
            break;
          case isLeftEdge:
            tileType = 4;
            break;
          case isRightEdge:
            tileType = 6;
            break;
          default:
            tileType = Math.floor(Math.random() * 3) + 1;
        }
        row.push(tileType);
      }
      newMap.push(row);
    }

    return newMap;
  }

  private map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  render(ctx: CanvasRenderingContext2D) {
    const offsetX = ctx.canvas.width / 2;
    const offsetY = 50;

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const tileId = this.map[y][x];
        const tileImg = this.images[tileId];

        if (!tileImg) continue;

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
