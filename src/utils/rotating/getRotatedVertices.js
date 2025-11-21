export const getRotatedVertices = (node) => {
  const { x, y } = node.position;
  const { width, height } = node.dimension;
  const { rotation: angle } = node;

  const centerX = x + width / 2;
  const centerY = y + height / 2;

  const corners = [
    { x: x, y: y },
    { x: x + width, y: y },
    { x: x + width, y: y + height },
    { x: x, y: y + height },
  ];

  const xCoords = [];
  const yCoords = [];

  const rotatedCorners = corners.map((corner) => {
    const offsetX = corner.x - centerX;
    const offsetY = corner.y - centerY;

    const rotatedX = offsetX * Math.cos(angle) - offsetY * Math.sin(angle);
    const rotatedY = offsetX * Math.sin(angle) + offsetY * Math.cos(angle);

    const x = Number((centerX + rotatedX).toFixed(2));
    const y = Number((centerY + rotatedY).toFixed(2));

    xCoords.push(x);
    yCoords.push(y);

    return { x, y };
  });

  const minX = Math.min(...xCoords);
  const maxX = Math.max(...xCoords);
  const minY = Math.min(...yCoords);
  const maxY = Math.max(...yCoords);

  return {
    topLeft: rotatedCorners[0],
    topRight: rotatedCorners[1],
    bottomRight: rotatedCorners[2],
    bottomLeft: rotatedCorners[3],
    width: Number((maxX - minX).toFixed(2)),
    height: Number((maxY - minY).toFixed(2)),
    minX,
    maxX,
    minY,
    maxY,
  };
};
