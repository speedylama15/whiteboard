import { getNodeCoords } from "./getNodeCoords";

const getKey = (map) => {
  const entries = Object.entries(map);

  if (entries.length === 0) return null;

  let count = 0;
  let qualifyingKeys = [];

  entries.forEach((entry) => {
    const gap = parseFloat(entry[0]);
    const length = entry[1].length;

    if (length > count) {
      qualifyingKeys = [];
      count = length;
    }

    if (length === count) {
      qualifyingKeys.push(gap);
    }
  });

  return Math.max(...qualifyingKeys);
};

export const getAllAlignments = (baseNode, nearbyNodes, threshold = 5) => {
  let horizontalMap = {};
  let verticalMap = {};

  const { x: bXs, y: bYs } = getNodeCoords(baseNode);

  let s_x_gap = threshold;
  let s_y_gap = threshold;

  nearbyNodes.forEach((item) => {
    const nearbyNode = item.node;
    const { x: nXs, y: nYs } = getNodeCoords(nearbyNode);

    nXs.forEach((n_x) => {
      bXs.forEach((b_x) => {
        const yCoords = [...nYs, ...bYs];
        const start = Math.min(...yCoords) - 10;
        const end = Math.max(...yCoords) + 10;

        const gap = n_x - b_x;
        const absGap = Math.abs(b_x - n_x);

        if (absGap <= 5) {
          if (absGap < s_x_gap) {
            verticalMap = {};
            s_x_gap = absGap;
          }

          if (absGap === s_x_gap) {
            const data = {
              gap,
              baseNode,
              nearbyNode,
              lineStart: [n_x, start],
              lineEnd: [n_x, end],
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

    nYs.forEach((n_y) => {
      bYs.forEach((b_y) => {
        const xCoords = [...nXs, ...bXs];
        const start = Math.min(...xCoords) - 10;
        const end = Math.max(...xCoords) + 10;

        const gap = n_y - b_y;
        const absGap = Math.abs(b_y - n_y);

        if (absGap <= 5) {
          if (absGap < s_y_gap) {
            horizontalMap = {};
            s_y_gap = absGap;
          }

          if (absGap === s_y_gap) {
            const data = {
              gap,
              baseNode,
              nearbyNode,
              lineStart: [start, n_y],
              lineEnd: [end, n_y],
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

  const horizontalKey = getKey(horizontalMap);
  const verticalKey = getKey(verticalMap);

  const horizontal = horizontalKey === null ? [] : horizontalMap[horizontalKey];
  const vertical = verticalKey === null ? [] : verticalMap[verticalKey];

  return {
    horizontal,
    vertical,
  };
};
