export const getPanValues = (e, wrapperRect) => {
  let panX = 0;
  let panY = 0;

  const PAN_SPEED = 12;
  const EDGE_THRESHOLD = 10;

  const { clientX, clientY } = e;
  const {
    x: wrapperX,
    y: wrapperY,
    width: wrapperWidth,
    height: wrapperHeight,
  } = wrapperRect;

  if (clientX - wrapperX <= EDGE_THRESHOLD || clientX < wrapperX)
    panX = PAN_SPEED;

  if (
    wrapperX + wrapperWidth - clientX <= EDGE_THRESHOLD ||
    clientX > wrapperX + wrapperWidth
  )
    panX = -PAN_SPEED;

  if (clientY - wrapperY <= EDGE_THRESHOLD || clientY < wrapperY)
    panY = PAN_SPEED;

  if (
    wrapperY + wrapperHeight - clientY <= EDGE_THRESHOLD ||
    clientY > wrapperY + wrapperHeight
  ) {
    panY = -PAN_SPEED;
  }

  return { panX, panY };
};
