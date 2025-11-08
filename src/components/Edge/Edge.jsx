import { memo } from "react";

import useApp from "../../store/useApp";

import { getHandleCoords } from "../../utils/getHandleCoords";
import { getPathData } from "../../utils/getPathData";

import "./Edge.css";

const Edge = memo(({ edge }) => {
  // idea: maybe requestAnimation thingy may help, but I am not sure
  const { sourceNodeID, targetNodeID, sourceLocation, targetLocation } = edge;

  const nodesMap = useApp((state) => state.nodesMap);
  const sourceNode = nodesMap[sourceNodeID];
  const targetNode = nodesMap[targetNodeID];

  const sourceHandleCoords = getHandleCoords(sourceNode, sourceLocation);
  const targetHandleCoords = getHandleCoords(targetNode, targetLocation);

  const pathData = getPathData(
    sourceLocation,
    targetLocation,
    sourceHandleCoords,
    targetHandleCoords
  );

  return (
    <div className="edge">
      <svg>
        <path d={pathData} stroke="#ff8400ff" fill="none" strokeWidth={2} />
      </svg>
    </div>
  );
});

export default Edge;
