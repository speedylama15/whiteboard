import { useEffect, useRef } from "react";

import useTree from "../../../store/useTree";
import useApp from "../../../store/useApp";

const NodesTree = () => {
  const nodesTree = useTree((state) => state.nodesTree);

  // necessary UI data
  const wrapperRect = useApp((state) => state.wrapperRect);
  const scale = useApp((state) => state.scale);
  const panOffsetXY = useApp((state) => state.panOffsetXY);

  const canvasRef = useRef();

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
    ctx.translate(panOffsetXY.x, panOffsetXY.y);
    ctx.scale(scale, scale);
    ctx.lineWidth = 3;

    nodesTree.all().forEach((item) => {
      ctx.strokeStyle = "#ff7b00ff";
      ctx.strokeRect(
        item.minX,
        item.minY,
        item.maxX - item.minX,
        item.maxY - item.minY
      );
    });

    ctx.restore();
  }, [nodesTree, wrapperRect, scale, panOffsetXY]);

  return (
    <canvas
      ref={canvasRef}
      width={wrapperRect.width}
      height={wrapperRect.height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 100,
        pointerEvents: "none",
      }}
    />
  );
};

export default NodesTree;
