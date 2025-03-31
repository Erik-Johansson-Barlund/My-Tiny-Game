// Helper function to load images from a registry
async function loadImages(
  registry: Record<string, string>
): Promise<Record<string, HTMLImageElement>> {
  const images: Record<string, HTMLImageElement> = {};

  const loadPromises = Object.entries(registry).map(([key, path]) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        images[key] = img;
        resolve();
      };
      img.onerror = () => reject(`Failed to load image: ${path}`);
    });
  });

  await Promise.all(loadPromises);
  return images;
}

export async function loadAssets(): Promise<{
  tiles: Record<string, HTMLImageElement>;
  rocks: Record<string, HTMLImageElement>;
}> {
  const tiles = await loadImages(tileRegistry);
  const rocks = await loadImages(rockRegistry);

  return { tiles, rocks };
}

export const tileRegistry: Record<string, string> = {
  grass1: "assets/tiles/grass1.png",
  grass2: "assets/tiles/grass2.png",
  grass3: "assets/tiles/grass3.png",
  edgeLeft: "assets/tiles/edgeLeft.png",
  edgeTopLeft: "assets/tiles/edgeTopLeft.png",
  edgeRight: "assets/tiles/edgeRight.png",
  edgeTopRight: "assets/tiles/edgeTopRight.png",
  edgeCenter: "assets/tiles/edgeCenter.png",
};

export const rockRegistry: Record<string, string> = {
  rock1: "assets/obstacles/rock1.png",
};
