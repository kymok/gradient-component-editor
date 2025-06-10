import { sRGB, convert, OKLCH, isRGBInGamut, DisplayP3, gamutMapOKLCH, sRGBGamut, MapToCuspL, DisplayP3Gamut, sRGBLinear, DisplayP3Linear } from "@texel/color";

export const lchToLinearRgb = (
  l: number,
  c: number,
  h: number,
  gamut: "srgb" | "display-p3"
): [number, number, number, boolean] => {
  if (gamut === "srgb") {
    const lrgb = convert([l, c, h], OKLCH, sRGBLinear);
    const isInGamut = isRGBInGamut(lrgb); // should use linear values if to be handled correctly
    return [lrgb[0], lrgb[1], lrgb[2], isInGamut];
  } else if (gamut === "display-p3") {
    const lrgb = convert([l, c, h], OKLCH, DisplayP3Linear);
    const isInGamut = isRGBInGamut(lrgb); // should use linear values if to be handled correctly
    return [lrgb[0], lrgb[1], lrgb[2], isInGamut];
  } else {
    throw new Error("Invalid target color space");
  }
}

export const lchToRgbWithGamutMapping = (
  l: number,
  c: number,
  h: number,
  gamut: "srgb" | "display-p3"
): [number, number, number, boolean] => {
  if (gamut === "srgb") {
    const rgb = convert([l, c, h], OKLCH, sRGB);
    const isInGamut = isRGBInGamut(rgb); // should use linear values if to be handled correctly
    const _rgb = [0, 0, 0];
    gamutMapOKLCH([l, c, h], sRGBGamut, sRGB, _rgb, MapToCuspL);
    return [_rgb[0], _rgb[1], _rgb[2], isInGamut];
  } else if (gamut === "display-p3") {
    const rgb = convert([l, c, h], OKLCH, DisplayP3);
    const isInGamut = isRGBInGamut(rgb, 1e-6); // should use linear values if to be handled correctly
    const _rgb = [0, 0, 0];
    gamutMapOKLCH([l, c, h], DisplayP3Gamut, DisplayP3, _rgb, MapToCuspL);
    return [_rgb[0], _rgb[1], _rgb[2], isInGamut];
  } else {
    throw new Error("Invalid target color space");
  }
}

