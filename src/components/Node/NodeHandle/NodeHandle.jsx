import { memo } from "react";

import useApp from "../../../store/useApp";

import { getHandleCoords } from "../../../utils/getHandleCoords";

import "./NodeHandle.css";

const NodeHandle = memo(({ node, handleLocation }) => {
  const setMouseState = useApp((state) => state.setMouseState);

  const setNewEdgeStartCoords = useApp((state) => state.setNewEdgeStartCoords);
  const setNewEdgeStartLocation = useApp(
    (state) => state.setNewEdgeStartLocation
  );
  const setNewEdgeTargetCoords = useApp(
    (state) => state.setNewEdgeTargetCoords
  );

  const handleCoords = getHandleCoords(node, handleLocation);

  const handleMouseDown = (e) => {
    e.stopPropagation();

    setMouseState("dragging-edge");
    setNewEdgeStartCoords(handleCoords);
    setNewEdgeStartLocation(handleLocation);
    setNewEdgeTargetCoords(handleCoords);
  };

  return (
    <div
      className="node-handle"
      data-handle-location={handleLocation}
      onMouseDown={handleMouseDown}
    />
  );
});

export default NodeHandle;
