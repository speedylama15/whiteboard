import { clamp } from "./clamp";

export function getSnapXY(node, side, mouseXY) {
  const { x, y } = node.position;
  const { width, height } = node.dimension;
  const { rotation: angle } = node;

  // center of the node's local axis
  // x -> left to right
  // y -> up to bottom
  const localAxisCenterX = x + width / 2;
  const localAxisCenterY = y + height / 2;

  // find the coord of the localized mouse coords
  const x1 = mouseXY.x - localAxisCenterX;
  const y1 = mouseXY.y - localAxisCenterY;

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  // unrotated
  // localized coords
  const x2 = x1 * cos + y1 * sin;
  const y2 = -x1 * sin + y1 * cos;

  // range
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  let snapLocalX = null;
  let snapLocalY = null;

  if (side === "bottom" || side === "top") {
    snapLocalX = clamp(x2, -halfWidth, halfWidth);

    if (Math.abs(snapLocalX) <= 12) snapLocalX = 0;

    if (side === "bottom") snapLocalY = halfHeight;
    if (side === "top") snapLocalY = -halfHeight;
  } else if (side === "right" || side === "left") {
    snapLocalY = clamp(y2, -halfHeight, halfHeight);

    if (Math.abs(snapLocalY) <= 12) snapLocalY = 0;

    if (side === "right") snapLocalX = halfWidth;
    if (side === "left") snapLocalX = -halfWidth;
  }

  // add center coords to revert it back to whiteboard based coords
  const snapX = snapLocalX * cos - snapLocalY * sin + localAxisCenterX;
  const snapY = snapLocalX * sin + snapLocalY * cos + localAxisCenterY;

  return { x: snapX, y: snapY };
}
