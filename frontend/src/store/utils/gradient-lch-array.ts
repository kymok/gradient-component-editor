import { evaluateMonotonicCurve, CurveControlPoint } from "../../utils/curve";

export const getGradientLchArray = (
  lightnessPoints: CurveControlPoint[],
  chromaPoints: CurveControlPoint[],
  huePoints: CurveControlPoint[],
  resolution: number = 256,
): [number, number, number][] => {
  const evaluationLocations = Array.from({ length: resolution }, (_, i) => i / (resolution - 1));
  const lchValues = evaluationLocations.map((x) => {
    const l = evaluateMonotonicCurve(lightnessPoints, x);
    const c = evaluateMonotonicCurve(chromaPoints, x);
    const h = evaluateMonotonicCurve(huePoints, x);
    return [l, c, h] as [number, number, number];
  });
  return lchValues;
}
