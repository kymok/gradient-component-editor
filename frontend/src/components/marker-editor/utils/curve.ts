import { getInterpolator, CurveControlPoint, splitPointsToSegments } from "../../../utils/curve";

export const getSVGPaths = (
  points: CurveControlPoint[],
  nDiv: number = 64
): {
  path: string,
  fromPointId: string,
}[] => {
  const segments = splitPointsToSegments(points);
  return segments.map((segment) => {
    if (segment.length < 2) {
      return { path: '', fromPointId: '' };
    }
    if (segment.length === 2) {
      const p1 = segment[0];
      const p2 = segment[1];
      return {
        path: `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`,
        fromPointId: segment[0].id,
      };
    }
    const interpolator = getInterpolator(segment);
    const _nDiv = nDiv * (segment.length - 1);
    const coords = Array.from({ length: _nDiv + 1 }, (_, i) => i / _nDiv).map((t) => interpolator(t));
    const pathData = coords.map((coord, index) =>
      `${index === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`
    ).join(' ');
    return {
      path: pathData,
      fromPointId: segment[0].id,
    };
  }).filter((path) => path.path.length > 0);
}
