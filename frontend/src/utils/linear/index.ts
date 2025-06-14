export type LinearControlPoint<T> = {
  id: string;
  t: number;
  isSmooth: boolean;
  value: T;
}

export type SamplerData = {
  name: string;
}

export const normalizeLinearMarkerPoints = <T>(
  points: LinearControlPoint<T>[]
): LinearControlPoint<T>[] => {
  const newPoints = structuredClone(points);
  if (newPoints.length === 0) {
    return [];
  }
  newPoints[0].isSmooth = false;
  newPoints[newPoints.length - 1].isSmooth = false;

  const controlledPoints = newPoints.map(
    (p, index) => ({ ...p, index })
  ).filter(
    (point) => !point.isSmooth
  );
  for (let i = 0; i < controlledPoints.length - 1; i++) {
    const p1 = controlledPoints[i];
    const p2 = controlledPoints[i + 1];
    const xDiff = p2.t - p1.t;
    const step = xDiff / (p2.index - p1.index);
    for (let j = p1.index + 1; j < p2.index; j++) {
      newPoints[j].t = p1.t + step * (j - p1.index);
    }
  }
  return newPoints;
};

export const insertPoint = <T>(
  points: LinearControlPoint<T>[],
  newPoint: LinearControlPoint<T>
): LinearControlPoint<T>[] => {
  const newPoints = points.filter((p) => p.id !== newPoint.id);
  const index = newPoints.findIndex((p) => p.t > newPoint.t);
  if (index === -1) {
    newPoints.push(newPoint);
  } else {
    newPoints.splice(index, 0, newPoint);
  }
  return newPoints;
}

export const updatePoint = <T>(
  points: LinearControlPoint<T>[],
  newPoint: Partial<LinearControlPoint<T>> & {
    id: string;
  }
): LinearControlPoint<T>[] => {
  const index = points.findIndex((p) => p.id === newPoint.id);
  if (index === -1) {
    return points;
  }
  const _newPoint = {
    ...points[index],
    ...newPoint,
  };
  const newPoints = [...points];
  newPoints[index] = _newPoint;
  return newPoints;
}

export const deletePoints = <T>(
  points: LinearControlPoint<T>[],
  pointIds: string[]
): LinearControlPoint<T>[] => {
  const newPoints = points.filter((p) => !pointIds.includes(p.id));
  return newPoints;
}