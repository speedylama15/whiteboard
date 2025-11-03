export const getHandleControlCoords = (coords, direction, offset = 150) => {
  const { x, y } = coords;

  const coordsMap = {
    top: { x, y: y - offset },
    right: { x: x + offset, y },
    bottom: { x, y: y + offset },
    left: { x: x - offset, y },
  };

  return coordsMap[direction];
};
