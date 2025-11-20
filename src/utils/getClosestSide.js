export function getClosestSide(node, point) {
  const { position, dimension, rotation } = node;
  const { x, y } = position;
  const { width, height } = dimension;

  const centerX = x + width / 2;
  const centerY = y + height / 2;

  let px = point.x - centerX;
  let py = point.y - centerY;

  if (rotation !== 0) {
    const cos = Math.cos(-rotation);
    const sin = Math.sin(-rotation);
    const rotatedPx = px * cos - py * sin;
    const rotatedPy = px * sin + py * cos;
    px = rotatedPx;
    py = rotatedPy;
  }

  const halfWidth = width / 2;
  const halfHeight = height / 2;

  if (px === 0) {
    return py > 0 ? "bottom" : "top";
  }

  if (Math.abs(py / px) > halfHeight / halfWidth) {
    return py > 0 ? "bottom" : "top";
  } else {
    return px > 0 ? "right" : "left";
  }
}
