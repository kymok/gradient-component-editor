import { test, expect } from 'vitest';
import { extractCssColor } from './extract-css-color';

test('extractCssColor - valid hex color', () => {
  const cssText = `
    --color-1: #ff5733;
    --color-2: #fff;
  `;
  const colors = extractCssColor(cssText);
  expect(colors).toEqual(['#ff5733', '#fff']);
});

test('extractCssColor - valid rgb color', () => {
  const cssText = `
    --color-legacy-1: rgb(255, 87, 51);
    --color-legacy-2: rgba(255, 255, 255, 0.5);
    --color-1: rgb(0 128 0);
    --color-2: rgb(0 0 255 / 0.5);
    --color-3: rgb(0 0 255 / 50%);
    --color-4: rgb(0 0 255 / none);
    --color-5: rgb(0% 0% 20%);
  `;
  const colors = extractCssColor(cssText);
  expect(colors).toEqual([
    'rgb(255, 87, 51)',
    'rgba(255, 255, 255, 0.5)',
    'rgb(0 128 0)',
    'rgb(0 0 255 / 0.5)',
    'rgb(0 0 255 / 50%)',
    'rgb(0 0 255 / none)',
    'rgb(0% 0% 20%)'
  ]);
});

test('extractCssColor - valid hsl color', () => {
  const cssText = `
    --color-legacy-1: hsl(120, 100%, 50%);
    --color-legacy-2: hsla(240, 100%, 50%, 0.5);
    --color-1: hsl(0deg 100% 50%);
    --color-2: hsl(0rad 100% 50%);
    --color-3: hsl(0grad 100% 50%);
    --color-4: hsl(0turn 100% 50%);
    --color-5: hsla(0deg 100% 50% / none);
  `;
  const colors = extractCssColor(cssText);
  expect(colors).toEqual([
    'hsl(120, 100%, 50%)',
    'hsla(240, 100%, 50%, 0.5)',
    'hsl(0deg 100% 50%)',
    'hsl(0rad 100% 50%)',
    'hsl(0grad 100% 50%)',
    'hsl(0turn 100% 50%)',
    'hsla(0deg 100% 50% / none)'
  ]);
});

test('extractCssColor - valid hwb color', () => {
  const cssText = `
    --color-1: hwb(0deg 100% 50%);
    --color-2: hwb(0rad 100% 50%);
    --color-3: hwb(0grad 100% 50%);
    --color-4: hwb(0turn 100% 50%);
    --color-5: hwb(0deg 100% 50% / none);
  `;
  const colors = extractCssColor(cssText);
  expect(colors).toEqual([
    'hwb(0deg 100% 50%)',
    'hwb(0rad 100% 50%)',
    'hwb(0grad 100% 50%)',
    'hwb(0turn 100% 50%)',
    'hwb(0deg 100% 50% / none)'
  ]);
});

test('extractCssColor - valid lch color', () => {
  const cssText = `
    --color-1: lch(50% 100% 120deg);
    --color-2: lch(50% 100% 120rad);
    --color-3: lch(50% 100% 120grad);
    --color-4: lch(50% 100% 120turn);
    --color-5: lch(50% 100% 120deg / none);
  `;
  const colors = extractCssColor(cssText);
  expect(colors).toEqual([
    'lch(50% 100% 120deg)',
    'lch(50% 100% 120rad)',
    'lch(50% 100% 120grad)',
    'lch(50% 100% 120turn)',
    'lch(50% 100% 120deg / none)'
  ]);
});

test('extractCssColor - valid oklch color', () => {
  const cssText = `
    --color-1: oklch(50% 100% 120deg);
    --color-2: oklch(50% 100% 120rad);
    --color-3: oklch(50% 100% 120grad);
    --color-4: oklch(50% 100% 120turn);
    --color-5: oklch(50% 100% 120deg / none);
  `;
  const colors = extractCssColor(cssText);
  expect(colors).toEqual([
    'oklch(50% 100% 120deg)',
    'oklch(50% 100% 120rad)',
    'oklch(50% 100% 120grad)',
    'oklch(50% 100% 120turn)',
    'oklch(50% 100% 120deg / none)'
  ]);
});

test('extractCssColor - valid lab color', () => {
  const cssText = `
    --color-1: lab(29.2345% 39.3825 20.0664);
    --color-2: lab(50 100 120 / none);
  `;
  const colors = extractCssColor(cssText);
  expect(colors).toEqual([
    'lab(29.2345% 39.3825 20.0664)',
    'lab(50 100 120 / none)'
  ]);
});

test('extractCssColor - valid oklab color', () => {
  const cssText = `
    --color-1: oklab(50% 100 120);
    --color-2: oklab(50% 100 120 / none);
  `;
  const colors = extractCssColor(cssText);
  expect(colors).toEqual([
    'oklab(50% 100 120)',
    'oklab(50% 100 120 / none)'
  ]);
});

test('extractCssColor - valid color() function', () => {
  const cssText = `
    --color-1: color(srgb 0.5 0.5 0.5);
    --color-2: color(display-p3 0.5 0.5 0.5 / none);
    --color-3: color(a98-rgb 0.5 0.5 0.5 / 50%);
    --color-4: color(prophoto-rgb 0.5 0.5 0.5 / none);
    --color-5: color(rec2020 0.5 0.5 0.5 / none);
    --color-6: color(xyz-d50 0.5 0.5 0.5 / none);
    --color-7: color(xyz-d65 0.5 0.5 0.5 / none);
  `;
  const colors = extractCssColor(cssText);
  expect(colors).toEqual([
    'color(srgb 0.5 0.5 0.5)',
    'color(display-p3 0.5 0.5 0.5 / none)',
    'color(a98-rgb 0.5 0.5 0.5 / 50%)',
    'color(prophoto-rgb 0.5 0.5 0.5 / none)',
    'color(rec2020 0.5 0.5 0.5 / none)',
    'color(xyz-d50 0.5 0.5 0.5 / none)',
    'color(xyz-d65 0.5 0.5 0.5 / none)'
  ]);
});