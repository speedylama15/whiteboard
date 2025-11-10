export const getNodeCoords = (node) => {
  const { id, position, dimension } = node;

  const { x, y } = position;
  const { width, height } = dimension;

  return {
    id: id,
    x: [x, x + width / 2, x + width],
    y: [y, y + height / 2, y + height],
  };
};
