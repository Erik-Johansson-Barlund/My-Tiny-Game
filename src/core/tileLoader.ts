export async function loadTileImages(
  registry: Record<number, string>
): Promise<Record<number, HTMLImageElement>> {
  const images: Record<number, HTMLImageElement> = {};

  const loadPromises = Object.entries(registry).map(([key, path]) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        images[+key] = img;
        resolve();
      };
    });
  });

  await Promise.all(loadPromises);
  return images;
}

export const tileRegistry: Record<number, string> = {
  1: "../assets/tiles/grass1.png",
  2: "../assets/tiles/grass2.png",
  3: "../assets/tiles/grass3.png",
  4: "../assets/tiles/edgeLeft.png",
  5: "../assets/tiles/edgeTopLeft.png",
  6: "../assets/tiles/edgeRight.png",
  7: "../assets/tiles/edgeTopRight.png",
  8: "../assets/tiles/edgeCenter.png",
};
