export const getNodesMap = (nodes) => {
  const obj = {};

  nodes.forEach((node) => (obj[node.id] = node));

  return obj;
};
