import { test, expect } from 'vitest';
import { findNearestGradientParameter, oklabToOklch, oklchToOklab } from './nearest';
import type { Oklab } from '../types';

test('should convert between oklab and oklch correctly', () => {
    const oklab: Oklab = [0.5, 0.1, 0.2];
    const oklch = oklabToOklch(oklab);
    const backToOklab = oklchToOklab(oklch);

    // Check conversion roundtrip
    expect(backToOklab[0]).toBeCloseTo(oklab[0], 6);
    expect(backToOklab[1]).toBeCloseTo(oklab[1], 6);
    expect(backToOklab[2]).toBeCloseTo(oklab[2], 6);
});

test('should handle negative hue values correctly', () => {
    const oklab: Oklab = [0.5, -0.1, -0.2];
    const oklch = oklabToOklch(oklab);
    // Negative hue should be converted to positive (0-360 range)
    expect(oklch[2]).toBeGreaterThanOrEqual(0);
    expect(oklch[2]).toBeLessThanOrEqual(360);
});

test('should handle single sample case with min-delta-E', () => {
    const samples: Oklab[] = [[0.5, 0.1, 0.2]];
    const target: Oklab = [0.6, 0.15, 0.25];
    const result = findNearestGradientParameter(samples, target, 'color');

    expect(result.t).toBe(0);
    expect(result.distance).toBeGreaterThan(0);
});

test('should handle single sample case with min-delta-L', () => {
    const samples: Oklab[] = [[0.5, 0.1, 0.2]];
    const target: Oklab = [0.6, 0.15, 0.25];
    const result = findNearestGradientParameter(samples, target, 'lightness');

    expect(result.t).toBe(0);
    expect(result.distance).toBeCloseTo(10); // |0.6 - 0.5| * 100
});

test('should throw error for invalid method', () => {
    const samples: Oklab[] = [[0.5, 0.1, 0.2]];
    const target: Oklab = [0.6, 0.15, 0.25];
    expect(() => {
      // @ts-expect-error Testing invalid method
      findNearestGradientParameter(samples, target, 'invalid');
    }).toThrow('Not implemented method');
});

test('should find exact match with min-delta-E', () => {
    const samples: Oklab[] = [
      [0, 0, 0],
      [0.5, 0.1, 0.2],
      [1, 0, 0]
    ];
    const target: Oklab = [0.5, 0.1, 0.2]; // Exactly matches middle sample
    const result = findNearestGradientParameter(samples, target, 'color');

    expect(result.t).toBeCloseTo(0.5, 6);
    expect(result.distance).toBeCloseTo(0, 6);
});

test('should find exact match with min-delta-L', () => {
    const samples: Oklab[] = [
      [0, 0, 0],
      [0.5, 0.1, 0.2],
      [1, 0, 0]
    ];
    const target: Oklab = [0.5, 0.3, 0.4]; // Matches L component of middle sample
    const result = findNearestGradientParameter(samples, target, 'lightness');

    expect(result.t).toBeCloseTo(0.5, 6);
    expect(result.distance).toBeCloseTo(0, 6);
});

test('should handle interpolation between samples with min-delta-E', () => {
    const samples: Oklab[] = [
      [0, 0, 0],
      [1, 1, 1]
    ];
    const target: Oklab = [0.3, 0.3, 0.3]; // Should be 30% along the gradient
    const result = findNearestGradientParameter(samples, target, 'color');

    expect(result.t).toBeCloseTo(0.3, 2);
});

test('should handle interpolation between samples with min-delta-L', () => {
    const samples: Oklab[] = [
      [0, 0, 0],
      [1, 1, 1]
    ];
    const target: Oklab = [0.3, 0.5, 0.5]; // Should be 30% along the gradient (only L matters)
    const result = findNearestGradientParameter(samples, target, 'lightness');

    expect(result.t).toBeCloseTo(0.3, 2);
});

test('should handle edge case where closest point is at start', () => {
    const samples: Oklab[] = [
      [0, 0, 0],
      [1, 1, 1]
    ];
    const target: Oklab = [-0.5, -0.5, -0.5]; // Closest to start point
    const result = findNearestGradientParameter(samples, target, 'color');

    expect(result.t).toBeCloseTo(0, 6);
});

test('should handle edge case where closest point is at end', () => {
    const samples: Oklab[] = [
      [0, 0, 0],
      [1, 1, 1]
    ];
    const target: Oklab = [1.5, 1.5, 1.5]; // Closest to end point
    const result = findNearestGradientParameter(samples, target, 'color');

    expect(result.t).toBeCloseTo(1, 6);
});
