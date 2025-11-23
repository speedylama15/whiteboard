import useApp from "../../store/useApp";
import useEdge from "../../store/useEdge";

import { getHandleCoords } from "../../utils/getHandleCoords";
import { getControlPoint } from "../../utils/getControlPoint";

import "./NewEdge.css";

const NewEdge = () => {
  const { sourceID, sourceLoc, targetID, targetLoc, targetXY } = useEdge(
    (state) => state.edgeData
  );

  const sNode = useApp((state) => state.nodesMap[sourceID]);
  const sCoord = getHandleCoords(sNode, sourceLoc);
  const sControl = getControlPoint(sCoord, sourceLoc, 150);

  let pathData = null;

  if (targetID) {
    // coords is already there. Calculate the control using targetXY
    const tControl = getControlPoint(targetXY, targetLoc, 150);

    pathData = `M ${sCoord.x} ${sCoord.y} C ${sControl.x} ${sControl.y} ${tControl.x} ${tControl.y} ${targetXY.x} ${targetXY.y}`;
  } else {
    pathData = `M ${sCoord.x} ${sCoord.y} Q ${sControl.x} ${sControl.y} ${targetXY.x} ${targetXY.y}`;
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
