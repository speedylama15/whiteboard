import useApp from "../../store/useApp";
import useEdge from "../../store/useEdge";

import { getControlPoint } from "../../utils/getControlPoint";
import { getHandleCoords } from "../../utils/getHandleCoords";

import "./NewEdge.css";

const NewEdge = () => {
  const nodesMap = useApp((state) => state.nodesMap);

  const newEdge = useEdge((state) => state.newEdge);
  const { sourceID, targetID, sourceLoc, targetLoc, targetXY } = newEdge;

  const sourceNode = useApp((state) => state.nodesMap[sourceID]);
  const sourceXY = getHandleCoords(sourceNode, sourceLoc);
  const sourceControl = getControlPoint(sourceXY, sourceLoc, 150);

  let pathData = null;

  if (targetID) {
    const targetNode = nodesMap[targetID];
    const targetXY = getHandleCoords(targetNode, targetLoc);
    const targetControl = getControlPoint(targetXY, targetLoc, 150);

    pathData = `M ${sourceXY.x},${sourceXY.y} C ${sourceControl.x}, ${sourceControl.y} ${targetControl.x}, ${targetControl.y}, ${targetXY.x}, ${targetXY.y}`;
  } else {
    pathData = `M ${sourceXY.x},${sourceXY.y} C ${sourceControl.x}, ${sourceControl.y} ${targetXY.x}, ${targetXY.y}, ${targetXY.x}, ${targetXY.y}`;
  }

  return (
    <>
      <svg>
        <path d={pathData} stroke="#000000ff" fill="none" strokeWidth={2} />
      </svg>
    </>
  );
};

export default NewEdge;
