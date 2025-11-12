import { getNodeCoords } from "./getNodeCoords";

export const getAllAlignments = (baseNode, nearbyNodes, threshold = 5) => {
  let horizontal = [];
  let vertical = [];

  const { x: bXs, y: bYs } = getNodeCoords(baseNode);

  let s_gap = threshold;

  nearbyNodes.forEach((item) => {
    const nearbyNode = item.node;
    const { x: nXs, y: nYs } = getNodeCoords(nearbyNode);

    nXs.forEach((n_x) => {
      bXs.forEach((b_x) => {
        const yCoords = [...nYs, ...bYs];
        const start = Math.min(...yCoords) - 10;
        const end = Math.max(...yCoords) + 10;

        const gap = Math.abs(b_x - n_x);

        if (gap <= 5) {
          if (gap < s_gap) {
            vertical = [];
            s_gap = gap;
          }

          if (gap === s_gap) {
            const data = {
              gap: n_x - b_x,
              currCoord: b_x,
              coordToSnap: n_x,
              baseNode,
              nearbyNode,
              lineStart: [n_x, start],
              lineEnd: [n_x, end],
            };

            vertical.push(data);
          }
        }
      });
    });

    nYs.forEach((n_y) => {
      bYs.forEach((b_y) => {
        const xCoords = [...nXs, ...bXs];
        const start = Math.min(...xCoords) - 10;
        const end = Math.max(...xCoords) + 10;

        const gap = Math.abs(b_y - n_y);

        if (gap <= 5) {
          if (gap < s_gap) {
            horizontal = [];
            s_gap = gap;
          }

          if (gap === s_gap) {
            const data = {
              gap: n_y - b_y,
              currCoord: b_y,
              coordToSnap: n_y,
              baseNode,
              nearbyNode,
              lineStart: [start, n_y],
              lineEnd: [end, n_y],
            };

            horizontal.push(data);
          }
        }
      });
    });
  });

  return { horizontal, vertical };
};
