export const clamp = (value: number, min: number, max: number): number => {
  const _min = Math.min(min, max);
  const _max = Math.max(min, max);
  return Math.max(_min, Math.min(_max, value));
}

export const findNearestPointOnLineSegment = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number
): { x: number; y: number } => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) {
    return { x: x1, y: y1 };
  }
  const t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
  const clampedT = clamp(t, 0, 1);
  return {
    x: x1 + clampedT * dx,
    y: y1 + clampedT * dy,
  };
}