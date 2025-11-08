import React from "react";

import useApp from "../../store/useApp";

import { getControlPoint } from "../../utils/getControlPoint";

import "./NewEdge.css";

const NewEdge = () => {
  const {
    isDisplayed,
    id,
    sourceNodeID,
    targetNodeID,
    sourceLocation,
    targetLocation,
    sourceCoords,
    targetCoords,
    targetOffset,
  } = useApp((state) => state.newEdge);

  // debug
  console.log({ sourceCoords });

  const sControl = getControlPoint(sourceCoords, sourceLocation, 100);
  const pathData = `M ${sourceCoords.x},${sourceCoords.y} C ${sControl.x}, ${sControl.y} ${targetCoords.x}, ${targetCoords.y}, ${targetCoords.x}, ${targetCoords.y}`;

  return (
    <>
      {isDisplayed && (
        <div className="new-edge">
          <svg>
            <path d={pathData} stroke="#f700ffff" fill="none" strokeWidth={2} />
          </svg>
        </div>
      )}
    </>
  );
};

export default NewEdge;
