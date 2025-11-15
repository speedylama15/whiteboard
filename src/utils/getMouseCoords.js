export const getWhiteboardCoords = (e, panOffsetXY, scale, wrapperRect) => {
  const clickX = e.clientX - wrapperRect.x;
  const clickY = e.clientY - wrapperRect.y;

  const x = Math.floor((clickX - panOffsetXY.x) / scale);
  const y = Math.floor((clickY - panOffsetXY.y) / scale);

  return { x, y };
};
