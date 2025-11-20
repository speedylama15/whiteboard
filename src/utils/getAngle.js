export function getAngle(e, rotator) {
  const node = rotator.closest(".node");

  const rect = node.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let angle = Math.atan2(e.pageX - centerX, -(e.pageY - centerY));
  if (angle < 0) angle += 2 * Math.PI;

  return angle;
}
