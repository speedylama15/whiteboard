import { getNodeCoords } from "./getNodeCoords";

export const getAllAlignments = (baseNode, nearbyNodes, threshold = 5) => {
  const alignments = { horizontal: [], vertical: [] };

  const baseNodeCoords = getNodeCoords(baseNode);

  nearbyNodes.forEach((nearbyNode) => {
    const nearbyNodeCoords = getNodeCoords(nearbyNode.node);

    const { x, y } = nearbyNodeCoords;

    Object.entries(x).forEach((nearbyX) => {
      Object.entries(baseNodeCoords.x).forEach((baseX) => {
        if (Math.abs(baseX[1] - nearbyX[1]) <= threshold) {
          const data = {
            b_id: baseNodeCoords.id,
            n_id: nearbyNodeCoords.id,
            b_match_location: baseX[0],
            n_match_location: nearbyX[0],
            currCoord: baseX[1],
            coord: nearbyX[1],
          };

          alignments.vertical.push(data);
        }
      });
    });

    Object.entries(y).forEach((nearbyY) => {
      Object.entries(baseNodeCoords.y).forEach((baseY) => {
        if (Math.abs(baseY[1] - nearbyY[1]) <= threshold) {
          const data = {
            b_id: baseNodeCoords.id,
            n_id: nearbyNodeCoords.id,
            b_match_location: baseY[0],
            n_match_location: nearbyY[0],
            currCoord: baseY[1],
            coord: nearbyY[1],
          };

          alignments.horizontal.push(data);
        }
      });
    });
  });

  return alignments;
};
