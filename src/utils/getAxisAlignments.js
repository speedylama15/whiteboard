const getLines = (map) => {
  const keys = Object.keys(map);

  if (keys.length > 2 || keys.length === 0) {
    return [];
  }

  return map[keys[0]];
};

const getBoxEdgesCoords = (node) => {
  const { id, position, dimension } = node;

  const { x, y } = position;
  const { width, height } = dimension;

  return {
    id: id,
    x: [x, Number((x + width / 2).toFixed(2)), Number((x + width).toFixed(2))],
    y: [
      y,
      Number((y + height / 2).toFixed(2)),
      Number((y + height).toFixed(2)),
    ],
  };
};

export const getAxisAlignments = (baseNode, nearbyNodes, threshold = 5) => {
  let horizontalMap = {};
  let verticalMap = {};

  const { x: baseXs, y: baseYs } = getBoxEdgesCoords(baseNode);

  let smallestXGap = threshold;
  let smallestYGap = threshold;

  nearbyNodes.forEach((item) => {
    const nearbyNode = {
      id: item.node.id,
      position: { x: item.minX, y: item.minY },
      dimension: { width: item.width, height: item.height },
    };

    const { x: nearbyXs, y: nearbyYs } = getBoxEdgesCoords(nearbyNode);

    nearbyXs.forEach((n_x) => {
      baseXs.forEach((b_x) => {
        const yCoords = [...nearbyYs, ...baseYs];
        const start = Math.min(...yCoords) - 10;
        const end = Math.max(...yCoords) + 10;

        const gap = n_x - b_x;
        const absGap = Math.abs(b_x - n_x);

        if (absGap <= 5) {
          if (absGap < smallestXGap) {
            verticalMap = {};
            smallestXGap = absGap;
          }

          if (absGap === smallestXGap) {
            const data = {
              type: "axis",
              gap,
              baseNode,
              nearbyNode,
              lineStart: { x: n_x, y: start },
              lineEnd: { x: n_x, y: end },
            };

            if (verticalMap[gap]) {
              verticalMap[gap].push(data);
            } else {
              verticalMap[gap] = [data];
            }
          }
        }
      });
    });

    nearbyYs.forEach((n_y) => {
      baseYs.forEach((b_y) => {
        const xCoords = [...nearbyXs, ...baseXs];
        const start = Math.min(...xCoords) - 10;
        const end = Math.max(...xCoords) + 10;

        const gap = n_y - b_y;
        const absGap = Math.abs(b_y - n_y);

        if (absGap <= 5) {
          if (absGap < smallestYGap) {
            horizontalMap = {};
            smallestYGap = absGap;
          }

          if (absGap === smallestYGap) {
            const data = {
              type: "axis",
              gap,
              baseNode,
              nearbyNode,
              lineStart: { x: start, y: n_y },
              lineEnd: { x: end, y: n_y },
            };

            if (horizontalMap[gap]) {
              horizontalMap[gap].push(data);
            } else {
              horizontalMap[gap] = [data];
            }
          }
        }
      });
    });
  });

  return {
    horizontalLines: getLines(horizontalMap),
    verticalLines: getLines(verticalMap),
  };
};
