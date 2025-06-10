export const serializesRgb = (rgb: [number, number, number]): string => {
  const [r, g, b] = rgb.map((value) => Math.round(value * 255));
  return `rgb(${r} ${g} ${b})`;
}

export const serializeP3Rgb = (rgb: [number, number, number]): string => {
  const [r, g, b] = rgb;
  return `color(display-p3 ${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)})`;
}

export const serializeOklch = (oklch: [number, number, number]): string => {
  const [l, c, h] = oklch.map((value) => value);
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`;
}
