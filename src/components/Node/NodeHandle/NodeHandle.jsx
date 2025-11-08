import { memo } from "react";

import useApp from "../../../store/useApp";

import "./NodeHandle.css";

const NodeHandle = memo(({ handleLocation, handleCoords }) => {
  const handleMouseDown = (e) => {
    e.stopPropagation();

    // const nodeID = e.currentTarget.dataset.nodeId;
    // const location = e.currentTarget.dataset.handleLocation;
  };

  return (
    <div
      data-handle-location={handleLocation}
      className="node-handle"
      onMouseDown={handleMouseDown}
    />
  );
});

export default NodeHandle;
