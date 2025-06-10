import bspline from 'b-spline';

const MAX_DEGREE = 3
const SMOOTH_DEFAULT_WEIGHT = 1;

export type CurveControlPoint = {
  x: number;
  y: number;
  isSmooth: boolean;
  id: string;
  weight?: number;
  isExternal?: boolean;
}

type Coordinate = {
  x: number;
  y: number;
}

type Interpolator = (t: number) => Coordinate;

const lerp = (
  p1: CurveControlPoint,
  p2: CurveControlPoint,
  t: number
) => {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  }
}

export const getClampedKnots = (
  degree: number,
  numPoints: number
): number[] => {
  const numKnots = numPoints + degree + 1;
  const numUniqueKnot = numKnots - degree * 2;
  const knots = Array(numKnots).fill(0);
  for (let i = degree + 1; i < numKnots; i++) {
    if (i < numUniqueKnot + degree) {
      knots[i] = i - degree;
    } else {
      knots[i] = numUniqueKnot - 1;
    }
  }
  return knots;
}

export const splitPointsToSegments = (
  points: CurveControlPoint[]
): CurveControlPoint[][] => {
  const segments: CurveControlPoint[][] = [];
  let curve: CurveControlPoint[] = [];
  for (const p of points) {
    if (curve.length === 0) {
      curve.push(p);
    }
    else {
      if (p.isSmooth) {
        curve.push(p);
      }
      else {
        curve.push(p);
        segments.push(curve);
        curve = [];
        curve.push(p);
      }
    }
  }
  if (curve.length > 0) {
    segments.push(curve);
  }
  return segments;
}

export const getInterpolator = (
  points: CurveControlPoint[]
): Interpolator => {
  if (points.length === 0) {
    throw new Error('No points provided');
  }
  if (points.length === 1) {
    return () => ({ x: points[0].x, y: points[0].y });
  }
  if (points.length <= 2) {
    return (t: number) => lerp(points[0], points[1], t);
  }

  const degree = Math.min(MAX_DEGREE, points.length - 1);
  const knots = getClampedKnots(degree, points.length);
  return (t: number) => {
    const p = bspline(
      t,
      degree,
      points.map((p) => [p.x, p.y]),
      knots,
      points.map((p) => p.weight ?? p.isSmooth ? SMOOTH_DEFAULT_WEIGHT : 1),
    )
    return { x: p[0], y: p[1] };
  }
}

export const evaluateMonotonicCurve = (
  points: CurveControlPoint[],
  x: number,
  epsilon: number = 0.001,
  maxIterations: number = 1000
) => {
  if (points.length === 0) {
    throw new Error('No points provided');
  }
  if (points.length === 1) {
    return points[0].y;
  }

  // use end values for out of range
  if (x < points[0].x) {
    return points[0].y;
  }
  if (x > points[points.length - 1].x) {
    return points[points.length - 1].y;
  }

  const segments = splitPointsToSegments(points);
  const segment = segments.find((segment) => {
    return segment[0].x <= x && segment[segment.length - 1].x >= x;
  });
  if (segment === undefined) {
    throw new Error('No segment found');
  }

  // segment is point
  if (segment.length === 1) {
    return segment[0].y;
  }
  // segment is line
  if (segment.length === 2) {
    return lerp(segment[0], segment[1], (x - segment[0].x) / (segment[1].x - segment[0].x)).y;
  }
  // segment is curve
  const interpolator = getInterpolator(segment);
  // binary search
  let left = 0;
  let right = 1;
  for (let i=0; i<maxIterations; i++) {
    const mid = (left + right) / 2;
    const p = interpolator(mid);
    if (p.x < x) {
      left = mid;
    } else {
      right = mid;
    }
    if (right - left < epsilon) {
      break;
    }
  }
  const p = interpolator(left);
  return p.y;
}

export const updatePoint = (
  points: CurveControlPoint[],
  newPoint: Partial<CurveControlPoint> & {
    x: number;
    y: number;
    id: string;
  }
): CurveControlPoint[] => {
  const _point = points.find((p) => p.id === newPoint.id);
  if (_point === undefined) {
    return points;
  };
  const _newPoint = {
    ..._point,
    ...newPoint,
  };
  return insertPoint(points, _newPoint);
}

export const insertPoint = (
  points: CurveControlPoint[],
  newPoint: CurveControlPoint
): CurveControlPoint[] => {
  const newPoints = points.filter((p) => p.id !== newPoint.id);
  const index = newPoints.findIndex((p) => p.x > newPoint.x);
  if (index === -1) {
    newPoints.push(newPoint);
  } else {
    newPoints.splice(index, 0, newPoint);
  }
  return newPoints;
}

export const deletePoints = (
  points: CurveControlPoint[],
  pointIds: string[]
): CurveControlPoint[] => {
  const newPoints = points.filter((p) => !pointIds.includes(p.id));
  return newPoints;
}