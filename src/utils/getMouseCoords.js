export const getWhiteboardCoords = (e, wrapperRef, panOffsetCoords, scale) => {
  const rect = wrapperRef.current.getBoundingClientRect();

  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  const x = (clickX - panOffsetCoords.x) / scale;
  const y = (clickY - panOffsetCoords.y) / scale;

  return { x, y };
};
