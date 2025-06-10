import { CurveControlPoint } from "../../utils/curve";
import { LinearControlPoint } from "../../utils/linear";

export const defaultEvaluationPointsOnEmpty: LinearControlPoint<null>[] = [{
  id: "empty-evaluation-point",
  t: 0.5,
  isSmooth: false,
  value: null,
}];

export const DefaultLightnessPointsOnEmpty: CurveControlPoint[] = [{
  id: "empty-lightness-point",
  x: 0,
  y: 0.5,
  isExternal: false,
  isSmooth: false,
}]

export const DefaultChromaPointsOnEmpty: CurveControlPoint[] = [{
  id: "empty-chroma-point",
  x: 0,
  y: 0,
  isExternal: false,
  isSmooth: false,
}]

export const DefaultHuePointsOnEmpty: CurveControlPoint[] = [{
  id: "empty-hue-point",
  x: 0,
  y: 240,
  isExternal: false,
  isSmooth: false,
}]
