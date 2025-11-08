export const getHandleCoords = (node, location) => {
  const { dimension, position } = node;
  const { width, height } = dimension;
  const { x, y } = position;

  const coords = {
    top: { x: x + width / 2, y },
    right: { x: x + width, y: y + height / 2 },
    bottom: { x: x + width / 2, y: y + height },
    left: { x, y: y + height / 2 },
  };

  return coords[location];
};
