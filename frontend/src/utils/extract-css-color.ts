const hexPattern = /#(?:[0-9a-fA-F]{3,4}\b|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
const rgbPattern = /rgba?\(\s*\d+%?\s*,?\s*\d+%?\s*,?\s*\d+%?\s*(?:[,/]\s*(?:[\d.]+%?|none)\s*)?\)/g;
const hslPattern = /hsla?\(\s*\d+(?:deg|rad|grad|turn)?\s*,?\s*\d+%?\s*,?\s*\d+%?\s*(?:[,/]\s*(?:[\d.]+%?|none)\s*)?\)/g;
const hwbPattern = /hwb\(\s*\d+(?:deg|rad|grad|turn)?\s*\d+%?\s*\d+%?\s*(?:\/\s*(?:[\d.]+%?|none)\s*)?\)/g;
const lchPattern = /(?:ok)?lch\(\s*[\d.]+%?\s*[\d.]+%?\s*[\d.]+(?:deg|rad|grad|turn)?\s*(?:\/\s*(?:[\d.]+%?|none)\s*)?\)/g;
const labPattern = /(?:ok)?lab\(\s*[\d.]+%?\s*[\d.]+%?\s*[\d.]+%?\s*(?:\/\s*(?:[\d.]+%?|none)\s*)?\)/g;
const colorPattern = /color\((?:srgb|srgb-linear|display-p3|a98-rgb|prophoto-rgb|rec2020|xyz|xyz-d50|xyz-d65)\s*[\d.]+%?\s*[\d.]+%?\s*[\d.]+%?\s*(?:\/\s*(?:[\d.]+%?|none)\s*)?\)/g;

export const extractCssColor = (cssFragment: string): string[] => {
  const hexMatches = cssFragment.match(hexPattern) || [];
  const rgbMatches = cssFragment.match(rgbPattern) || [];
  const hslMatches = cssFragment.match(hslPattern) || [];
  const hwbMatches = cssFragment.match(hwbPattern) || [];
  const lchMatches = cssFragment.match(lchPattern) || [];
  const labMatches = cssFragment.match(labPattern) || [];
  const colorMatches = cssFragment.match(colorPattern) || [];
  return Array.from(new Set([
    ...hexMatches,
    ...rgbMatches,
    ...hslMatches,
    ...hwbMatches,
    ...lchMatches,
    ...labMatches,
    ...colorMatches
  ]));
}