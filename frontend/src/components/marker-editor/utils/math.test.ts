import { clamp } from "./math";
import { it, expect } from "vitest";

it ("clamp", () => {
  const min = 0;
  const max = 10;
  expect(clamp(5, min, max)).toBe(5);
  expect(clamp(15, min, max)).toBe(max);
  expect(clamp(-5, min, max)).toBe(min);
});
