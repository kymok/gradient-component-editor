import { Match, MatchingError, Oklab, Oklch } from "../types";
import { MatchingMethod } from "../types";

export const oklabToOklch = (ol: Oklab): Oklch => {
  const [l, a, b] = ol;
  const c = Math.sqrt(a * a + b * b);
  const h = Math.atan2(b, a) * (180 / Math.PI);
  return [l, c, h < 0 ? h + 360 : h];
}

export const oklchToOklab = (oc: Oklch): Oklab => {
  const [l, c, h] = oc;
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);
  return [l, a, b];
}

const wrapHue = (h: number): number => {
  let _h = h % 360;
  if (_h < -180) {
    _h += 360;
  } else if (_h > 180) {
    _h -= 360;
  }
  return _h;
}

const EPSILON = 1e-6;

const computeMatchingError = (target: Oklab, current: Oklab): MatchingError => {
  const current_lch = oklabToOklch(current);
  const target_lch = oklabToOklch(target);
  const deltaL = current_lch[0] - target_lch[0];
  const deltaC = current_lch[1] - target_lch[1];
  const deltaHdeg = (current_lch[1] < EPSILON || target_lch[1] < EPSILON) ? Number.NaN : wrapHue(current_lch[2] - target_lch[2]);
  return {
    deltaL,
    deltaC,
    deltaHdeg,
  };
}
  

/**
 * Finds the parameter (between 0 and 1) of the gradient that gives the color nearest to the target color.
 * @param samples Array of oklab colors, sampled sequentially and evenly from the gradient.
 * @param target Target oklab color.
 * @param method Matching method: 'delta_E' (Euclidean) or 'delta_L' (L difference).
 * @returns Parameter (0-1) of the gradient where the nearest color is found.
 */
export const findNearestGradientParameter = (
  samples: Oklab[],
  target: Oklab,
  method: MatchingMethod
): Match => {
  if (samples.length < 2) {
    if (method === 'color') {
      return {
        t: 0,
        distance: Math.sqrt(
          (samples[0][0] - target[0]) ** 2 +
          (samples[0][1] - target[1]) ** 2 +
          (samples[0][2] - target[2]) ** 2
        ) * 100, // Scale to 0-100
        color: samples[0],
        matchingError: computeMatchingError(target, samples[0]),
        isError: false,
      };
    }
    if (method === 'lightness') {
      return {
        t: 0,
        distance: Math.abs(samples[0][0] - target[0]) * 100, // Scale to 0-100
        color: samples[0],
        matchingError: computeMatchingError(target, samples[0]),
        isError: false,
      };
    }
    throw new Error("Not implemented method");
  }

  let minDist = Infinity;
  let minParam = 0;
  let matchedColor: Oklab = samples[0];

  const n = samples.length;
  for (let i = 0; i < n - 1; i++) {
    const a = samples[i];
    const b = samples[i + 1];

    // Vector from a to b
    const ab: Oklab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    // Vector from a to target
    const at: Oklab = [target[0] - a[0], target[1] - a[1], target[2] - a[2]];

    // Project at onto ab to get t in [0,1]
    let abLenSq: number;
    if (method === 'color') {
      abLenSq = ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2;
    } else if (method === 'lightness') {
      abLenSq = ab[0] ** 2; // Only L component for delta_L
    } else {
      throw new Error("No1t implemented method");
    }

    const dot =
      method === 'color'
        ? ab[0] * at[0] + ab[1] * at[1] + ab[2] * at[2]
        : ab[0] * at[0];

    let t = abLenSq > 0 ? dot / abLenSq : 0;
    t = Math.max(0, Math.min(1, t));
    const interp: Oklab = [
      a[0] + ab[0] * t,
      a[1] + ab[1] * t,
      a[2] + ab[2] * t,
    ];

    // Distance
    const dist = method === 'color'
      ? Math.sqrt(
          (interp[0] - target[0]) ** 2 +
          (interp[1] - target[1]) ** 2 +
          (interp[2] - target[2]) ** 2
        )
      : Math.abs(interp[0] - target[0]);

    // Compute parameter in [0,1]
    const param = (i + t) / (n - 1);

    if (dist < minDist) {
      minDist = dist;
      minParam = param;
      matchedColor = interp;
    }
  }

  return {
    t: minParam,
    distance: minDist * 100, // Scale to 0-100
    color: matchedColor,
    matchingError: computeMatchingError(target, matchedColor),
    isError: false,
  };
}