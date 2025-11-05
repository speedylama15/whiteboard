import { useEffect, useRef } from "react";

import useApp from "../../store/useApp";

import { getNodeCoords } from "../../utils/getNodeCoords";
import { getAlignments } from "../../utils/getAlignments";

import "./Canvas.css";

const Canvas = () => {
  const tree = useApp((state) => state.tree);
  const wrapperRect = useApp((state) => state.wrapperRect);
  const scale = useApp((state) => state.scale);
  const panOffsetPos = useApp((state) => state.panOffsetPos);
  const selectedNode = useApp((state) => state.selectedNode);

  const canvasRef = useRef();
  const ctx = useRef;

  // debug: for visual purposes
  useEffect(() => {
    if (!tree) return;

    const canvas = canvasRef.current;
    ctx.current = canvas.getContext("2d");

    ctx.current.clearRect(0, 0, canvas.width, canvas.height);

    // saves the current canvas state (transforms, styles, clipping)
    ctx.current.save();
    ctx.current.translate(panOffsetPos.x, panOffsetPos.y);
    ctx.current.scale(scale, scale);

    // restores back to the last saved state
    ctx.current.restore();
  }, [tree, panOffsetPos, scale, ctx]);

  useEffect(() => {
    if (!selectedNode) return;

    ctx.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    const BOUNDARY = 100;
    const { dimension, position } = selectedNode;
    const { width, height } = dimension;
    const { x, y } = position;

    ctx.current.save();
    ctx.current.translate(panOffsetPos.x, panOffsetPos.y);
    ctx.current.scale(scale, scale);

    const selectedNodeCoords = getNodeCoords(selectedNode);

    tree
      .search({
        minX: x - BOUNDARY,
        maxX: x + width + BOUNDARY,
        minY: y - BOUNDARY,
        maxY: y + height + BOUNDARY,
      })
      .filter((data) => data.node.id !== selectedNode.id)
      .forEach((data) => {
        const { node } = data;

        const coords = getNodeCoords(node);

        const { horizontal, vertical } = getAlignments(
          selectedNodeCoords,
          coords,
          10
        );

        if (horizontal.length) {
          // fix
          horizontal.forEach((y) => {
            ctx.current.beginPath();
            ctx.current.moveTo(0, y);
            ctx.current.lineTo(10000, y);
            ctx.current.stroke();
          });
        }
        if (vertical.length) {
          // fix
          vertical.forEach((x) => {
            ctx.current.beginPath();
            ctx.current.moveTo(x, 0);
            ctx.current.lineTo(x, 10000);
            ctx.current.stroke();
          });
        }

        ctx.current.strokeStyle = "red";
        ctx.current.lineWidth = 3;
        ctx.current.strokeRect(
          node.position.x,
          node.position.y,
          node.dimension.width,
          node.dimension.height
        );
      });

    ctx.current.strokeStyle = "gold";
    ctx.current.lineWidth = 5;
    ctx.current.strokeRect(
      x - BOUNDARY,
      y - BOUNDARY,
      BOUNDARY + BOUNDARY + width,
      BOUNDARY + BOUNDARY + height
    );

    ctx.current.restore();
  }, [tree, selectedNode, ctx, panOffsetPos, scale]);

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
