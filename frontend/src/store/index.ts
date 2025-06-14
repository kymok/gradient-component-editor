import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { CurveControlPoint, evaluateMonotonicCurve } from "../utils/curve";
import { normalizeLinearMarkerPoints, LinearControlPoint, SamplerData } from "../utils/linear";
import { defaultCyan } from "./defaults";
import { DefaultChromaPointsOnEmpty, defaultEvaluationPointsOnEmpty, DefaultHuePointsOnEmpty, DefaultLightnessPointsOnEmpty } from "./defaults/empty";
import { ContrastGridReferenceColor, ContrastGridReferenceColorInternal, ReferenceInternal, ShadeGeneratorParameter } from "./types";
import { SetStateAction } from "jotai";
import { getGradientLchArray } from "./utils/gradient-lch-array";
import { evaluateReference } from "./utils/evaluate-reference";
import { Gamut } from '../utils/gamut';
import { lchToRgbWithGamutMapping } from "../components/backdrop/lchToRgb";
import { serializeOklch, serializeP3Rgb, serializesRgb } from "../utils/serialize-color";
import { parse, RGBToHex, sRGB } from "@texel/color";
import { simplifyPolyline } from "./utils/simplify-polyline";

export const gamutAtom = atom<Gamut>("display-p3");
export const themeAtom = atom<"light" | "dark">("light");

export const paramAtomFamily = atomFamily(
  (id: string) => atom<ShadeGeneratorParameter>({
    ...defaultCyan,
    id,
  })
);

const contrastGridReferenceColorInternalsAtom = atom<ContrastGridReferenceColorInternal[]>([
  { name: "white", color: "rgb(255, 255, 255)" },
  { name: "black", color: "rgb(0, 0, 0)" },
]);

export const contrastGridReferenceColorsAtom = atom(
  (get) => {
    const referenceColors = get(contrastGridReferenceColorInternalsAtom);
    return referenceColors.map((ref) => {
      const [r, g, b] = parse(ref.color, sRGB);
      return {
        r,
        g,
        b,
        color: ref.color,
        name: ref.name,
      } as ContrastGridReferenceColor;
    });
  },
  (get, set, update: SetStateAction<ContrastGridReferenceColorInternal[]>) => {
    const current = get(contrastGridReferenceColorInternalsAtom);
    const newReferenceColors = typeof update === "function" ? update(current) : update;
    set(contrastGridReferenceColorInternalsAtom, newReferenceColors);
  }
);

const DEFAULT_ID = "default";
export const paramIdsAtom = atom<string[]>([DEFAULT_ID]);
export const activeParamIdAtom = atom<string>(DEFAULT_ID);

export const setParamAtom = atom(
  null,
  (_get, set, update: ShadeGeneratorParameter) => {
    const id = update.id;
    set(paramAtomFamily(id), update);
  }
);

const EVAL_RESOLUTION = 256;
export const getGradientLchArrayAtom = atomFamily((id: string) => atom(
  (get) => {
    const lightnessPoints = get(lightnessPointsAtom(id));
    const chromaPoints = get(chromaPointsAtom(id));
    const huePoints = get(huePointsAtom(id));
    return getGradientLchArray(
      lightnessPoints,
      chromaPoints,
      huePoints,
      EVAL_RESOLUTION,
    );
  }
));
const getGradientLabArrayAtom = atomFamily((id: string) => atom(
  (get) => {
    const lchArray = get(getGradientLchArrayAtom(id));
    return lchArray.map(([l, c, h]) => {
      const rad = (h * Math.PI) / 180;
      const a = c * Math.cos(rad);
      const b = c * Math.sin(rad);
      return [l, a, b] as [number, number, number];
    });
  }
));
export const getApproximateGradientLabArrayAtom = atomFamily((id: string) => atom(
  (get) => {
    const labArray = get(getGradientLabArrayAtom(id));
    const epsilon = 0.005;
    const simplified = simplifyPolyline(
      labArray.map(([l, a, b], i) => [l, a, b, i / (labArray.length - 1)] as [number, number, number, number]),
      epsilon
    );
    return simplified;
  }
));

export const lightnessPointsAtom = atomFamily((id: string) => atom(
  (get) => {
    const param = get(paramAtomFamily(id));
    const lightnessPoints = param.lightness;
    const points = lightnessPoints.sort((a, b) => a.x - b.x);
    if (points.length === 0) {
      return DefaultLightnessPointsOnEmpty;
    }
    return points;
  },
  (get, set, update: SetStateAction<CurveControlPoint[]>) => {
    const current = get(paramAtomFamily(id));
    const currentLightness = get(lightnessPointsAtom(id));
    const newLightnessPoints = typeof update === "function" ? update(currentLightness) : update;
    set(paramAtomFamily(id), {
      ...current,
      lightness: newLightnessPoints,
    });
  }
));

export const chromaPointsAtom = atomFamily((id: string) => atom(
  (get) => {
    const param = get(paramAtomFamily(id));
    const chromaPoints = param.chroma;
    const points = chromaPoints.sort((a, b) => a.x - b.x);
    if (points.length === 0) {
      return DefaultChromaPointsOnEmpty;
    }
    return points;
  },
  (get, set, update: SetStateAction<CurveControlPoint[]>) => {
    const current = get(paramAtomFamily(id));
    const currentChroma = get(chromaPointsAtom(id));
    const newChroma = typeof update === "function" ? update(currentChroma) : update;
    set(paramAtomFamily(id), {
      ...current,
      chroma: newChroma,
    });
  }
));

export const huePointsAtom = atomFamily((id: string) => atom(
  (get) => {
    const param = get(paramAtomFamily(id));
    const huePoints = param.hue;
    const points = huePoints.sort((a, b) => a.x - b.x);
    if (points.length === 0) {
      return DefaultHuePointsOnEmpty;
    }
    return points;
  },
  (get, set, update: SetStateAction<CurveControlPoint[]>) => {
    const current = get(paramAtomFamily(id));
    const currentHue = get(huePointsAtom(id));
    const newHue = typeof update === "function" ? update(currentHue) : update;
    set(paramAtomFamily(id), {
      ...current,
      hue: newHue,
    });
  }
));

export const evaluationLocationsAtom = atomFamily((id: string) => atom(
  (get) => {
    const param = get(paramAtomFamily(id));
    const points = param.sampler;
    if (points.length === 0) {
      return defaultEvaluationPointsOnEmpty;
    }
    const evaluated = normalizeLinearMarkerPoints(points);
    return evaluated;
  },
  (get, set, update: SetStateAction<LinearControlPoint<SamplerData>[]>) => {
    const current = get(evaluationLocationsAtom(id));
    const newPoints = typeof update === "function" ? update(current) : update;
    set(paramAtomFamily(id), {
      ...get(paramAtomFamily(id)),
      sampler: newPoints,
    });
  }
));

// gradient swatches

export const getAllGradientSwatchesAtom = atom((get) => {
  const paramIds = get(paramIdsAtom);
  return paramIds.map((id) => get(getGradientSwatchesAtom(id)));
});

export const getGradientSwatchesAtom = atomFamily((id: string) => atom(
  (get) => {
    const evaluationLocations = get(evaluationLocationsAtom(id));
    const lightnessPoints = get(lightnessPointsAtom(id));
    const chromaPoints = get(chromaPointsAtom(id));
    const huePoints = get(huePointsAtom(id));
    const gamut = get(gamutAtom);
    const { name } = get(paramAtomFamily(id));

    const evaluationResults = evaluationLocations.map((p) => {
      const l = evaluateMonotonicCurve(lightnessPoints, p.t)
      const c = evaluateMonotonicCurve(chromaPoints, p.t)
      const h = evaluateMonotonicCurve(huePoints, p.t)
      const [p3r, p3g, p3b, isInP3Gamut] = lchToRgbWithGamutMapping(l, c, h, 'display-p3');
      const [sr, sg, sb, isInSrgbGamut] = lchToRgbWithGamutMapping(l, c, h, 'srgb');
      const srgbString = serializesRgb([sr, sg, sb]);
      const displayP3String = serializeP3Rgb([p3r, p3g, p3b]);
      const oklchString = serializeOklch([l, c, h]);
      const [r, g, b] = lchToRgbWithGamutMapping(l, c, h, gamut);
      const serializedColor = gamut === 'display-p3' ? serializeP3Rgb([r, g, b]) : serializesRgb([r, g, b]);
      return {
        p3: {
          r: p3r,
          g: p3g,
          b: p3b,
          isInGamut: isInP3Gamut,
          cssString: displayP3String,
        },
        srgb: {
          r: sr,
          g: sg,
          b: sb,
          isInGamut: isInSrgbGamut,
          cssString: srgbString,
          hexString: RGBToHex([sr, sg, sb]),
        },
        oklch: {
          l: l,
          c: c,
          h: h,
          cssString: oklchString,
        },
        serializedColor,
        name: p.value?.name || `t${p.t.toFixed(2)}`
      }
    });
    return ({
      name,
      swatches: evaluationResults
    });
  }
));

// Reference colors

export const getReferenceColorsAtom = atomFamily((id: string) => atom((get) => {
  const param = get(paramAtomFamily(id));
  const evaluatedReferences = param.references.map((ref) => (
    evaluateReference(ref, get(getGradientLabArrayAtom(id)))
  ));
  return evaluatedReferences;
}));

export const setReferenceColorsAtom = atomFamily((id: string) => atom(
  null,
  (get, set, update: SetStateAction<ReferenceInternal[]>) => {
    const current = get(paramAtomFamily(id));
    const references = get(getReferenceColorsAtom(id));
    // update references
    const newReferences = typeof update === "function" ? update(references) : update;
    set(paramAtomFamily(id), {
      ...current,
      references: newReferences,
    });
  }
));

// Import data
import { importDataSchema } from "./types";

export const importGradientData = atom(
  null,
  (_get, set, jsonString: string) => {
    try {
      // Parse JSON
      const data = JSON.parse(jsonString);
      
      // Validate with zod schema
      const validatedData = importDataSchema.parse(data);
      
      // Update state
      // First clear existing parameters
      const newParamIds = validatedData.parameters.map(param => param.id);
      set(paramIdsAtom, newParamIds);
      
      // Set each parameter
      validatedData.parameters.forEach(param => {
        set(paramAtomFamily(param.id), param);
      });
      
      // Set active parameter
      set(activeParamIdAtom, validatedData.activeParamId);
      
      // Set contrast grid reference colors
      set(contrastGridReferenceColorInternalsAtom, 
        validatedData.contrastGridReferenceColors.map(c => ({
          name: c.name,
          color: c.color
        }))
      );

      return { success: true };
    } catch (error) {
      console.error('Failed to import data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
);
