export const getAlignments = (baseCoord, otherCoord, threshold = 5) => {
  const horizontal = new Set();
  const vertical = new Set();

  Object.values(baseCoord.x).forEach((baseX) => {
    Object.values(otherCoord.x).forEach((otherX) => {
      if (Math.abs(baseX - otherX) < threshold) {
        vertical.add(otherX);
      }
    });
  });

  Object.values(baseCoord.y).forEach((baseY) => {
    Object.values(otherCoord.y).forEach((otherY) => {
      if (Math.abs(baseY - otherY) < threshold) {
        horizontal.add(otherY);
      }
    });
  });

  return {
    horizontal: Array.from(horizontal),
    vertical: Array.from(vertical),
  };
};
