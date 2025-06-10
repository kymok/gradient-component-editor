import { OKLab, parse } from "@texel/color";
import { ReferenceInternal, Reference } from "../types";
import { findNearestGradientParameter } from "./nearest";

export const evaluateReference = (
  reference: ReferenceInternal,
  gradient: [number, number, number][]
): Reference => {
  const color = reference.color;
  try {
    const parsedColor = parse(color, OKLab);
    const match: Reference["match"] = findNearestGradientParameter(
      gradient,
      parsedColor as [number, number, number],
      reference.matchingMethod
    );
    const result: Reference = {
      ...reference,
      oklabColor: parsedColor as [number, number, number],
      match,
    };
    return result;
  } catch (_error) {
    return {
      ...reference,
      oklabColor: [0, 0, 0], // Fallback to black if parsing fails
      match: {
        t: 0,
        distance: Infinity, // Default values for match
        color: [0, 0, 0] as [number, number, number], // Fallback color
        isError: true, // Indicate an error occurred
        matchingError: {
          deltaL: Infinity,
          deltaC: Infinity,
          deltaHdeg: Infinity,
        }
      },
    };
  }
}