export const simplifyPolyline = (
  points: [number, number, number, number][],
  epsilon: number = 0.01
): [number, number, number, number][] => {
  if (points.length < 3) return points;

  const getDistance = (p: [number, number, number, number], a: [number, number, number, number], b: [number, number, number, number]) => {
    const [x, y, z] = p;
    const [x1, y1, z1] = a;
    const [x2, y2, z2] = b;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    if (dx === 0 && dy === 0 && dz === 0) {
      return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2 + (z - z1) ** 2);
    }
    const t = ((x - x1) * dx + (y - y1) * dy + (z - z1) * dz) / (dx * dx + dy * dy + dz * dz);
    const tClamped = Math.max(0, Math.min(1, t));
    const projX = x1 + tClamped * dx;
    const projY = y1 + tClamped * dy;
    const projZ = z1 + tClamped * dz;
    return Math.sqrt((x - projX) ** 2 + (y - projY) ** 2 + (z - projZ) ** 2);
  };

  let maxDist = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const dist = getDistance(points[i], points[0], points[points.length - 1]);
    if (dist > maxDist) {
      index = i;
      maxDist = dist;
    }
  }

  if (maxDist > epsilon) {
    const left = simplifyPolyline(points.slice(0, index + 1), epsilon);
    const right = simplifyPolyline(points.slice(index), epsilon);
    return left.slice(0, -1).concat(right);
  } else {
    return [points[0], points[points.length - 1]];
  }
};
