const horizontalEdges = ['left', 'right'];
const screenEdges = [...horizontalEdges, 'top', 'bottom'];

// Screen and window must use CSS pixels in the same desktop coordinate space.
export function closestDrawerEdge(workArea, windowBounds, fallback, sidesOnly = false) {
  const edges = sidesOnly ? horizontalEdges : screenEdges;
  const defaultEdge = edges.includes(fallback) ? fallback : 'right';
  const { left, top, width, height } = workArea;
  const { left: x, top: y, width: w, height: h } = windowBounds;
  if (![left, top, width, height, x, y, w, h].every(Number.isFinite) ||
      Math.min(width, height, w, h) <= 0 ||
      x + w / 2 < left || x + w / 2 > left + width ||
      y + h / 2 < top || y + h / 2 > top + height) return defaultEdge;

  const gaps = {
    left: Math.max(0, x - left),
    right: Math.max(0, left + width - x - w),
    top: Math.max(0, y - top),
    bottom: Math.max(0, top + height - y - h),
  };
  return edges.reduce((nearest, edge) => gaps[edge] < gaps[nearest] ? edge : nearest, defaultEdge);
}

// Browser demos always render inside the viewport. Narrow drawers use the
// bottom edge so their controls can keep the full available width.
export function drawerEdge({ sidesOnly = false } = {}) {
  if (!sidesOnly && window.matchMedia('(max-width: 36rem)').matches) return 'bottom';
  return closestDrawerEdge(
    { left: screen.availLeft, top: screen.availTop, width: screen.availWidth, height: screen.availHeight },
    { left: window.screenX, top: window.screenY, width: window.outerWidth, height: window.outerHeight },
    'right',
    sidesOnly,
  );
}
