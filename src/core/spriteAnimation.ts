export class SpriteAnimation {
  public currentFrame: number = 0;
  public elapsedTime: number = 0;

  constructor(
    public image: HTMLImageElement,
    public frameWidth: number,
    public frameHeight: number,
    public frameCount: number,
    public frameRate: number // frames per second
  ) {}

  update(delta: number): void {
    this.elapsedTime += delta;
    const frameDuration = 1 / this.frameRate;
    while (this.elapsedTime >= frameDuration) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
      this.elapsedTime -= frameDuration;
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number = 1
  ): void {
    const sourceX = this.currentFrame * this.frameWidth;
    ctx.drawImage(
      this.image,
      sourceX,
      0,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      this.frameWidth * scale,
      this.frameHeight * scale
    );
  }
}
