import { memo } from "react";

import useApp from "../../store/useApp";
import useEdge from "../../store/useEdge";

import { getHandleCoords } from "../../utils/getHandleCoords";
// import { getPathData } from "../../utils/getPathData";
import { getControlPoint } from "../../utils/getControlPoint";

import "./Edge.css";

const getEdgePointCoords = (node, coords) => {
  const { x, y } = node.position;
  const { width, height } = node.dimension;
  const { rotation: angle } = node;

  const centerX = x + width / 2;
  const centerY = y + height / 2;

  const localX = coords.x - centerX;
  const localY = coords.y - centerY;

  const rotatedX = localX * Math.cos(angle) - localY * Math.sin(angle);
  const rotatedY = localX * Math.sin(angle) + localY * Math.cos(angle);

  return { x: rotatedX + centerX, y: rotatedY + centerY };
};

const getPathData = ({
  sourceNode,
  sourceXY,
  sourceLoc,
  targetNode,
  targetXY,
  targetLoc,
}) => {
  const sCoords = getEdgePointCoords(sourceNode, sourceXY);
  const tCoords = getEdgePointCoords(targetNode, targetXY);

  const sControl = getEdgePointCoords(
    sourceNode,
    getControlPoint(sCoords, sourceLoc, 200)
  );
  const tControl = getEdgePointCoords(
    targetNode,
    getControlPoint(tCoords, targetLoc, 200)
  );

  const pathData = `M ${sCoords.x},${sCoords.y} C ${sControl.x}, ${sControl.y} ${tControl.x}, ${tControl.y}, ${tCoords.x}, ${tCoords.y}`;

  return pathData;
};

const Edge = memo(({ edgeID }) => {
  const edge = useEdge((state) => state.edgesMap[edgeID]);
  const { sourceID, targetID, sourceLoc, targetLoc, offset } = edge;

  const sourceNode = useApp((state) => state.nodesMap[sourceID]);
  const targetNode = useApp((state) => state.nodesMap[targetID]);
  const sourceXY = getHandleCoords(sourceNode, sourceLoc);
  const targetXY = getHandleCoords(targetNode, targetLoc);

  const axis = targetLoc === "top" || targetLoc === "bottom" ? "x" : "y";
  const otherAxis = axis === "x" ? "y" : "x";
  const targetXYWithOffset = {
    [axis]: targetXY[axis] + offset,
    [otherAxis]: targetXY[otherAxis],
  };

  const pathData = getPathData({
    sourceNode,
    sourceXY,
    sourceLoc,
    targetNode,
    targetXY: targetXYWithOffset,
    targetLoc,
  });

  // const pathData = getPathData(
  //   sourceLoc,
  //   targetLoc,
  //   getEdgePointCoords(sourceNode, sourceXY),
  //   getEdgePointCoords(targetNode, targetXYWithOffset)
  // );

  return (
    <div className="edge">
      <svg>
        <path
          d={pathData}
          stroke="#000000ff"
          fill="none"
          strokeWidth={2}
          markerEnd="url(#1__type=arrow)"
        />
      </svg>
    </div>
  );
});

export default Edge;
