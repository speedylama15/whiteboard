export const getHandleCoords = (node, direction) => {
  const { x, y } = node.position;
  const { width, height } = node.dimension;

  const coordsMap = {
    top: { x: x + width / 2, y },
    right: { x: x + width, y: y + height / 2 },
    bottom: { x: x + width / 2, y: y + height },
    left: { x, y: y + height / 2 },
  };

  return coordsMap[direction];
};
