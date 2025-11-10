import { memo } from "react";

import "./NodeHandle.css";

const NodeHandle = memo(({ handleLocation }) => {
  return <div data-handle-location={handleLocation} className="node-handle" />;
});

export default NodeHandle;
