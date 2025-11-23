import { useEffect, useRef } from "react";

import useApp from "../../store/useApp";

const AlignmentLines = () => {
  const verticalLines = useApp((state) => state.verticalLines);
  const horizontalLines = useApp((state) => state.horizontalLines);

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

    horizontalLines.forEach(({ lineStart, lineEnd }) => {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1 / scale;
      ctx.beginPath();
      ctx.moveTo(lineStart.x, lineStart.y);
      ctx.lineTo(lineEnd.x, lineEnd.y);
      ctx.stroke();
    });

    verticalLines.forEach(({ lineStart, lineEnd }) => {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1 / scale;
      ctx.beginPath();
      ctx.moveTo(lineStart.x, lineStart.y);
      ctx.lineTo(lineEnd.x, lineEnd.y);
      ctx.stroke();
    });

    ctx.restore();
  }, [horizontalLines, verticalLines, wrapperRect, scale, panOffsetXY]);

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

export default AlignmentLines;
