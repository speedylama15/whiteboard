import { memo } from "react";

import useApp from "../../store/useApp";

import { getHandleCoords } from "../../utils/getHandleCoords";
import { getPathData } from "../../utils/getPathData";

import "./Edge.css";

// TODO: needs to be selectable via click
const Edge = memo(({ edgeID }) => {
  const edge = useApp((state) => state.edgesMap[edgeID]);
  const { sourceID, targetID, sourceLoc, targetLoc } = edge;

  const sourceNode = useApp((state) => state.nodesMap[sourceID]);
  const targetNode = useApp((state) => state.nodesMap[targetID]);
  const sourceXY = getHandleCoords(sourceNode, sourceLoc);
  const targetXY = getHandleCoords(targetNode, targetLoc);

  const pathData = getPathData(sourceLoc, targetLoc, sourceXY, targetXY);

  return (
    <div className="edge">
      <svg>
        <path d={pathData} stroke="#000000ff" fill="none" strokeWidth={2} />
      </svg>
    </div>
  );
});

export default Edge;
