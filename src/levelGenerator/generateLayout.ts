const generateLayout = (totalRooms: number) => {
  const rows = 9;
  const cols = 9;
  let nextId = 1;

  const layout: any[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(0)
  );

  // Check if a cell is within grid bounds.
  const inBounds = (r: number, c: number) =>
    r >= 0 && r < rows && c >= 0 && c < cols;

  // Check if a cell has at least one neighboring room (cardinal directions).
  const hasRoomNeighbor = (r: number, c: number): boolean => {
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    return directions.some(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      return inBounds(nr, nc) && layout[nr][nc] != 0;
    });
  };

  let roomCount = 0;

  // Place the center room.
  const centerRow = Math.floor(rows / 2);
  const centerCol = Math.floor(cols / 2);
  layout[centerRow][centerCol] = nextId;
  nextId++;
  roomCount++;

  // Create an array of all cell coordinates.
  const allCoords: { r: number; c: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      allCoords.push({ r, c });
    }
  }

  // Shuffle the coordinates array for random iteration order.
  const shuffle = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Loop until we've reached the target number of rooms.
  while (roomCount < totalRooms) {
    let addedThisPass = false;
    const candidates: { r: number; c: number }[] = [];
    // Use a shuffled order to avoid directional bias.
    for (const { r, c } of shuffle(allCoords)) {
      if (layout[r][c] === 0 && hasRoomNeighbor(r, c)) {
        candidates.push({ r, c });
        // Base chance to add a room.
        let probability = 0.1;
        // Check for two consecutive neighbors in any cardinal direction.
        if (
          (c >= 2 && layout[r][c - 1] != 0 && layout[r][c - 2] != 0) ||
          (c <= cols - 3 && layout[r][c + 1] != 0 && layout[r][c + 2] != 0) ||
          (r >= 2 && layout[r - 1][c] != 0 && layout[r - 2][c] != 0) ||
          (r <= rows - 3 && layout[r + 1][c] != 0 && layout[r + 2][c] != 0)
        ) {
          probability = 0.7;
        }

        if (Math.random() < probability) {
          layout[r][c] = nextId;
          roomCount++;
          nextId++;
          addedThisPass = true;
          if (roomCount >= totalRooms) break;
        }
      }
    }

    // If no room was added this pass but there are eligible candidates, force-add one at random.
    if (!addedThisPass && candidates.length > 0) {
      const forcedCandidate =
        candidates[Math.floor(Math.random() * candidates.length)];
      layout[forcedCandidate.r][forcedCandidate.c] = nextId;
      roomCount++;
      nextId++;
      addedThisPass = true;
    }

    // If no new room was added at all (no candidates), break to avoid an infinite loop.
    if (!addedThisPass) break;
  }

  const flatRoomArray = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (layout[r][c] != 0) {
        const doorPositions = [];

        if (r > 0 && layout[r - 1][c] !== 0) {
          // Connect to the room above
          doorPositions.push({ door: 0, connection: layout[r - 1][c] });
        }
        if (c > 0 && layout[r][c - 1] !== 0) {
          // Connect to the room to the left
          doorPositions.push({ door: 1, connection: layout[r][c - 1] });
        }
        if (c < cols - 1 && layout[r][c + 1] !== 0) {
          // Connect to the room to the right
          doorPositions.push({ door: 2, connection: layout[r][c + 1] });
        }
        if (r < rows - 1 && layout[r + 1][c] !== 0) {
          // Connect to the room below
          doorPositions.push({ door: 3, connection: layout[r + 1][c] });
        }

        flatRoomArray.push({ doors: doorPositions, id: layout[r][c] });
      }
    }
  }

  return { layout: flatRoomArray.sort((a, b) => a.id - b.id), map: layout };
};

export { generateLayout };
