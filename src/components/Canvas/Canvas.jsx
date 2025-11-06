import { useEffect, useRef } from "react";

import useApp from "../../store/useApp";

import "./Canvas.css";

const Canvas = () => {
  const tree = useApp((state) => state.tree);
  const alignmentCoords = useApp((state) => state.alignmentCoords);

  const scale = useApp((state) => state.scale);
  const panOffsetPos = useApp((state) => state.panOffsetPos);

  const wrapperRect = useApp((state) => state.wrapperRect);

  const canvasRef = useRef();

  useEffect(() => {
    if (!alignmentCoords) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    ctx.save();
    ctx.translate(panOffsetPos.x, panOffsetPos.y);
    ctx.scale(scale, scale);

    const { horizontal, vertical } = alignmentCoords;

    // Horizontal lines
    horizontal.forEach((y) => {
      ctx.beginPath();
      ctx.moveTo(-10000, y.coord);
      ctx.lineTo(10000, y.coord);
      ctx.stroke();
    });

    // Vertical lines
    vertical.forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(x.coord, -10000);
      ctx.lineTo(x.coord, 10000);
      ctx.stroke();
    });

    ctx.restore();
  }, [tree, panOffsetPos, alignmentCoords, scale]);

  return (
    <canvas
      ref={canvasRef}
      width={wrapperRect.width}
      height={wrapperRect.height}
      style={{
        width: "100%",
        height: "100%",
        border: "2px solid #1e00ffff",
        pointerEvents: "none",
      }}
    />
  );
};

export default Canvas;
