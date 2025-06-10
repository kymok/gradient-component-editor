import { ShadeGeneratorParameter } from "../types";

export const samplerLinear5 = [
  { id: '000', t: 0, isSmooth: false, value: null },
  { id: '025', t: 0.25, isSmooth: true, value: null },
  { id: '050', t: 0.5, isSmooth: true, value: null },
  { id: '075', t: 0.75, isSmooth: true, value: null },
  { id: '100', t: 1, isSmooth: false, value: null },
];

export const samplerTailwindish11 = [
  { id: '050', t: 1 - 0.97, isSmooth: false, value: null },
  { id: '100', t: 1 - 0.94, isSmooth: false, value: null },
  { id: '200', t: 1 - 0., isSmooth: true, value: null },
  { id: '300', t: 1 - 0., isSmooth: true, value: null },
  { id: '400', t: 1 - 0., isSmooth: true, value: null },
  { id: '500', t: 1 - 0.623, isSmooth: false, value: null },
  { id: '600', t: 1 - 0., isSmooth: true, value: null },
  { id: '700', t: 1 - 0., isSmooth: true, value: null },
  { id: '800', t: 1 - 0., isSmooth: true, value: null },
  { id: '900', t: 1 - 0.379, isSmooth: false, value: null },
  { id: '950', t: 1 - 0.282, isSmooth: false, value: null },
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
