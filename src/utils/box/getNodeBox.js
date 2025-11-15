export const getNodeBox = (node) => {
  return {
    minX: node.position.x,
    minY: node.position.y,
    maxX: node.position.x + node.dimension.width,
    maxY: node.position.y + node.dimension.height,
    node,
  };
};
