export const getNodeCoords = (node) => {
  const { position, dimension } = node;

  const { x, y } = position;
  const { width, height } = dimension;

  return {
    x: { lx: x, cx: x + width / 2, rx: x + width },
    y: { ty: y, cy: y + height / 2, by: y + height },
  };
};
