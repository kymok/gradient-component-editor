import { CurveControlPoint } from "../../utils/curve";
import { LinearControlPoint, SamplerData } from "../../utils/linear";

export const defaultEvaluationPointsOnEmpty: LinearControlPoint<SamplerData>[] = [{
  id: "empty-evaluation-point",
  t: 0.5,
  isSmooth: false,
  value: { name: "" } as SamplerData,
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
