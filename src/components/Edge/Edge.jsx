import { memo } from "react";

import useApp from "../../store/useApp";

import { getHandleCoords } from "../../utils/getHandleCoords";
import { getPathData } from "../../utils/getPathData";

import "./Edge.css";

const Edge = memo(({ edgeID }) => {
  // idea: maybe requestAnimation thingy may help, but I am not sure
  const edge = useApp((state) => state.edgesMap[edgeID]);
  const { sourceNodeID, targetNodeID, sourceLocation, targetLocation } = edge;

  const sourceNode = useApp((state) => state.nodesMap[sourceNodeID]);
  const targetNode = useApp((state) => state.nodesMap[targetNodeID]);
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
        <path d={pathData} stroke="#000000ff" fill="none" strokeWidth={2} />
      </svg>
    </div>
  );
});

export default Edge;
