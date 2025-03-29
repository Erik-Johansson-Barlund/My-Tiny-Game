import { Game } from "./core/game";
import { tileRegistry, loadTileImages } from "./core/tileLoader";
import { TileMap } from "./map/tileMap";

const canvas = document.createElement("canvas");
const gameWidth = 800;
const gameHeight = 600;

canvas.width = gameWidth;
canvas.height = gameHeight;

canvas.style.position = "relative";
canvas.style.imageRendering = "pixelated";

function resizeCanvas() {
  const scale = Math.min(
    window.innerWidth / gameWidth,
    window.innerHeight / gameHeight
  );

  canvas.style.width = `${gameWidth * scale}px`;
  canvas.style.height = `${gameHeight * scale}px`;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
const gameBoard = document.getElementById("board");
gameBoard?.appendChild(canvas);

const ctx = canvas.getContext("2d");

if (!ctx) throw new Error("Canvas context not available");

loadTileImages(tileRegistry).then((images) => {
  const tileMap = new TileMap(images);
  const game = new Game(ctx, tileMap); // pass it in
  game.start();
});
