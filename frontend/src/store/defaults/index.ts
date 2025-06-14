import { ShadeGeneratorParameter } from "../types";
import { SamplerData } from "../../utils/linear";

export const samplerLinear5 = [
  { id: '000', t: 0, isSmooth: false, value: { name: '000' } as SamplerData },
  { id: '025', t: 0.25, isSmooth: true, value: { name: '025' } as SamplerData },
  { id: '050', t: 0.5, isSmooth: true, value: { name: '050' } as SamplerData },
  { id: '075', t: 0.75, isSmooth: true, value: { name: '075' } as SamplerData },
  { id: '100', t: 1, isSmooth: false, value: { name: '100' } as SamplerData },
];

export const samplerTailwindish11 = [
  { id: '050', t: 1 - 0.97, isSmooth: false, value: { name: '050' } as SamplerData },
  { id: '100', t: 1 - 0.94, isSmooth: false, value: { name: '100' } as SamplerData },
  { id: '200', t: 1 - 0., isSmooth: true, value: { name: '200' } as SamplerData },
  { id: '300', t: 1 - 0., isSmooth: true, value: { name: '300' } as SamplerData },
  { id: '400', t: 1 - 0., isSmooth: true, value: { name: '400' } as SamplerData },
  { id: '500', t: 1 - 0.623, isSmooth: false, value: { name: '500' } as SamplerData },
  { id: '600', t: 1 - 0., isSmooth: true, value: { name: '600' } as SamplerData },
  { id: '700', t: 1 - 0., isSmooth: true, value: { name: '700' } as SamplerData },
  { id: '800', t: 1 - 0., isSmooth: true, value: { name: '800' } as SamplerData },
  { id: '900', t: 1 - 0.379, isSmooth: false, value: { name: '900' } as SamplerData },
  { id: '950', t: 1 - 0.282, isSmooth: false, value: { name: '950' } as SamplerData },
]

const lightnessLinear = [
  { x: 0.0, y: 1.0, id: "l0", isSmooth: false },
  { x: 1.0, y: 0.0, id: "l1", isSmooth: false },
];

export const defaultBlue = {
  sampler: samplerTailwindish11,
  lightness: lightnessLinear,
  colorStops: [],
  chroma: [
    { x: 0.0, y: 0.0, id: "c0", isSmooth: false },
    { x: 0.25, y: 0.13, id: "c1", isSmooth: true },
    { x: 0.5, y: 0.3, id: "c2", isSmooth: true },
    { x: 0.75, y: 0.08, id: "c3", isSmooth: true },
    { x: 1.0, y: 0.0, id: "c4", isSmooth: false },
  ],
  hue: [
    { x: 0.0, y: 250, id: "h0", isSmooth: false },
    { x: 0.12, y: 270, id: "h1", isSmooth: true },
    { x: 1.0, y: 270, id: "h2", isSmooth: false },
  ]
}

const defaultCyanChroma = [
  { x: 0.0, y: 0.0, id: "c0", isSmooth: false },
  { x: 0.23, y: 0.172, id: "c1", isSmooth: false },
  { x: 1.0, y: 0.0, id: "c2", isSmooth: false },
]
const defaultCyanHue = [
  { x: 0.0, y: 206, id: "h0", isSmooth: false },
  { x: 0.12, y: 225, id: "h1", isSmooth: true },
  { x: 1.0, y: 225, id: "h2", isSmooth: false },
]

export const defaultCyan: ShadeGeneratorParameter = {
  id: "cyan",
  name: "Cyan",
  sampler: samplerTailwindish11,
  references: [],
  lightness: lightnessLinear,
  chroma: defaultCyanChroma,
  hue: defaultCyanHue,
};
