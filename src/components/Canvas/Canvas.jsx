import { useEffect, useRef } from "react";

import useApp from "../../store/useApp";

import "./Canvas.css";

// todo: addItemTreeMap
const Canvas = () => {
  const mouseState = useApp((state) => state.mouseState);

  const nodesMap = useApp((state) => state.nodesMap);
  const selectedNodesMap = useApp((state) => state.selectedNodesMap);

  const rTree = useApp((state) => state.rTree);
  const verticalLines = useApp((state) => state.verticalLines);
  const horizontalLines = useApp((state) => state.horizontalLines);

  const wrapperRect = useApp((state) => state.wrapperRect);

  const scale = useApp((state) => state.scale);
  const panOffsetCoords = useApp((state) => state.panOffsetCoords);

  const canvasRef = useRef();

  // set up tree
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Add this before any drawing
    const dpr = window.devicePixelRatio || 1;
    canvas.width = wrapperRect.width * dpr;
    canvas.height = wrapperRect.height * dpr;
    canvas.style.width = wrapperRect.width + "px";
    canvas.style.height = wrapperRect.height + "px";
    ctx.imageSmoothingEnabled = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.scale(dpr, dpr);
    ctx.translate(panOffsetCoords.x, panOffsetCoords.y);
    ctx.scale(scale, scale);
    ctx.lineWidth = 3;

    if (mouseState === "moving-node") {
      if (!rTree) return;

      rTree.all().forEach((item) => {
        ctx.strokeStyle = "#000000ff";
        ctx.strokeRect(
          item.minX,
          item.minY,
          item.maxX - item.minX,
          item.maxY - item.minY
        );
      });

      horizontalLines.forEach(({ lineStart, lineEnd }) => {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1 / scale;
        ctx.beginPath();
        ctx.moveTo(lineStart[0], lineStart[1]);
        ctx.lineTo(lineEnd[0], lineEnd[1]);
        ctx.stroke();
      });

      verticalLines.forEach(({ lineStart, lineEnd }) => {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1 / scale;
        ctx.beginPath();
        ctx.moveTo(lineStart[0], lineStart[1]);
        ctx.lineTo(lineEnd[0], lineEnd[1]);
        ctx.stroke();
      });
    }

    ctx.restore();
  }, [
    nodesMap,
    scale,
    panOffsetCoords,
    selectedNodesMap,
    rTree,
    mouseState,
    verticalLines,
    horizontalLines,
    wrapperRect,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={wrapperRect.width}
      height={wrapperRect.height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 100000000,
        pointerEvents: "none",
      }}
    />
  );
};

export default Canvas;
