import { getControlPoint } from "./getControlPoint";

export const getPathData = (sLoc, tLoc, sCoords, tCoords) => {
  const sControl = getControlPoint(sCoords, sLoc, 100);
  const tControl = getControlPoint(tCoords, tLoc, 100);

  const pathData = `M ${sCoords.x},${sCoords.y} C ${sControl.x}, ${sControl.y} ${tControl.x}, ${tControl.y}, ${tCoords.x}, ${tCoords.y}`;

  return pathData;
};
