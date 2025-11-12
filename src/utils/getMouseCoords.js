export const getWhiteboardCoords = (e, panOffsetCoords, scale, wrapperRect) => {
  const clickX = e.clientX - wrapperRect.x;
  const clickY = e.clientY - wrapperRect.y;

  const x = (clickX - panOffsetCoords.x) / scale;
  const y = (clickY - panOffsetCoords.y) / scale;

  return { x, y };
};
