export const getControlPoint = (coords, location, offset = 50) => {
  switch (location) {
    case "top":
      return { x: coords.x, y: coords.y - offset };
    case "bottom":
      return { x: coords.x, y: coords.y + offset };
    case "left":
      return { x: coords.x - offset, y: coords.y };
    case "right":
      return { x: coords.x + offset, y: coords.y };
    default:
      return { x: coords.x, y: coords.y };
  }
};
