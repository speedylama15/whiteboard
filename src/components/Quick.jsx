import { useState } from "react";
import * as d3 from "d3";

import "./Quick.css";

const getPath = (sourceCoords, targetCoords) => {
  const dx = targetCoords.x - sourceCoords.x;
  const dy = targetCoords.y - sourceCoords.y;

  // Curved line if far
  const offset = Math.abs(dx) * 0.5;
  const path = d3.path();
  path.moveTo(sourceCoords.x, sourceCoords.y);
  path.bezierCurveTo(
    sourceCoords.x + offset,
    sourceCoords.y, // Control point 1
    targetCoords.x,
    targetCoords.y, // Control point 2
    targetCoords.x,
    targetCoords.y // End point
  );

  return path.toString();
};

// const getPath = (sourceCoords, targetCoords) => {
//   const path = d3.path();

//   path.moveTo(sourceCoords.x, sourceCoords.y);
//   path.bezierCurveTo(
//     // control
//     sourceCoords.x,
//     sourceCoords.y,
//     // control

//     // control
//     targetCoords.x,
//     targetCoords.y,
//     // control

//     targetCoords.x,
//     targetCoords.y
//   );

//   return path;
// };

function Quick() {
  const [isDraggingHandle, setIsDraggingHandle] = useState(false);
  const [sourceCoords, setSourceCoords] = useState({ x: 300, y: 300 });
  const [targetCoords, setTargetCoords] = useState({ x: 0, y: 0 });
  const [containerRect, setContainerRect] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState(null);

  const handleMouseDown = (e) => {
    const handle = e.currentTarget;
    const container = e.target.closest(".quick-page_container");

    if (!container) return;

    const handleRect = handle.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setSourceCoords({
      x: handleRect.x - containerRect.x,
      y: handleRect.y - containerRect.y,
    });
    setTargetCoords({
      x: handleRect.x - containerRect.x,
      y: handleRect.y - containerRect.y,
    });
    setContainerRect({ x: containerRect.x, y: containerRect.y });
    setIsDraggingHandle(true);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingHandle) return;

    const { clientX, clientY } = e;

    const mouseX = clientX - containerRect.x;
    const mouseY = clientY - containerRect.y;

    setTargetCoords({ x: mouseX, y: mouseY });
  };

  const handleMouseUp = (e) => {
    setContainerRect({ x: 0, y: 0 });
  };

  return (
    // how can I handle this svg thing?
    // when the node is moving, I need the paths to be updated as well
    <div className="quick-page" onMouseMove={handleMouseMove}>
      <div className="quick-page_container">
        <div
          className="handle"
          onMouseDown={handleMouseDown}
          style={{
            backgroundColor: "orangered",
            transform: `translate(${sourceCoords.x}px, ${sourceCoords.y}px)`,
          }}
        />

        <svg width="100%" height="100%">
          {/* <circle
            cx={sourceCoords.x}
            cy={sourceCoords.y}
            r={10}
            fill="#4CAF50"
            style={{ cursor: "move" }}
            onMouseDown={handleMouseDown}
          /> */}

          {isDraggingHandle && (
            <g>
              <path
                d={getPath(sourceCoords, targetCoords)}
                stroke="#000"
                strokeWidth={2}
                fill="none"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

export default Quick;
