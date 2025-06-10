import { it, expect } from "vitest";
import { getClampedKnots } from ".";

it("getClampedKnots", () => {
  expect(getClampedKnots(2, 3)).toEqual([0, 0, 0, 1, 1, 1]);
  expect(getClampedKnots(2, 4)).toEqual([0, 0, 0, 1, 2, 2, 2]);
  expect(getClampedKnots(3, 4)).toEqual([0, 0, 0, 0, 1, 1, 1, 1]);
  expect(getClampedKnots(3, 6)).toEqual([0, 0, 0, 0, 1, 2, 3, 3, 3, 3]);
});