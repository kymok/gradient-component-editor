import { Getter } from "jotai";
import { activeParamIdAtom, contrastGridReferenceColorsAtom, getApproximateGradientLabArrayAtom, paramAtomFamily, paramIdsAtom } from ".";
import { ShadeGeneratorParameter } from "./types";
import { OKLab, serialize } from "@texel/color";

export const exportGradientData = (get: Getter) => {
  // Get all parameters
  const paramIds = get(paramIdsAtom);
  const parameters: ShadeGeneratorParameter[] = [];
  paramIds.forEach(id => {
    parameters.push(get(paramAtomFamily(id)));
  });

  // Get app configurations
  const activeParamId = get(activeParamIdAtom);
  const contrastGridReferenceColors = get(contrastGridReferenceColorsAtom);

  // Create export data
  const exportData = {
    version: "1.0",
    parameters,
    activeParamId,
    contrastGridReferenceColors
  };

  // Create and download file
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gradient-editor-export.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const getActiveApproximateGradient = (get: Getter) => {
  const activeParamId = get(activeParamIdAtom);
  const approximateGradient = get(getApproximateGradientLabArrayAtom(activeParamId));

  if (!approximateGradient) {
    console.error("No active parameter found for export.");
    return;
  }

  const stops = approximateGradient.map(
    (color) => `oklab(${color[0].toFixed(3)} ${color[1].toFixed(3)} ${color[2].toFixed(3)}) ${(color[3] * 100).toFixed(2)}%`
  );
  const gradientString = `linear-gradient(to right, ${stops.join(', ')})`;
  return gradientString;
}