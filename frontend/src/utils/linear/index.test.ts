import { it, expect } from "vitest";
import { normalizeLinearMarkerPoints } from ".";

it("normalizeLinearMarkerPoints", () => {
  expect(normalizeLinearMarkerPoints([
    { id: "point-0", t: 0, isSmooth: true, value: null },
    { id: "point-1", t: 1, isSmooth: true, value: null },
  ])).toEqual([
    { id: "point-0", t: 0, isSmooth: false, value: null },
    { id: "point-1", t: 1, isSmooth: false, value: null },
  ]);
});

it("normalizeLinearMarkerPoints", () => {
  expect(normalizeLinearMarkerPoints([
    { id: "point-0", t: 0, isSmooth: true, value: null },
    { id: "point-1", t: 1, isSmooth: false, value: null },
  ])).toEqual([
    { id: "point-0", t: 0, isSmooth: false, value: null },
    { id: "point-1", t: 1, isSmooth: false, value: null },
  ]);
});

it("normalizeLinearMarkerPoints", () => {
  expect(normalizeLinearMarkerPoints([
    { id: "point-0", t: 0, isSmooth: false, value: null },
    { id: "point-1", t: 0.1, isSmooth: true, value: null },
    { id: "point-2", t: 1, isSmooth: false, value: null },
  ])).toEqual([
    { id: "point-0", t: 0, isSmooth: false, value: null },
    { id: "point-1", t: 0.5, isSmooth: true, value: null },
    { id: "point-2", t: 1, isSmooth: false, value: null },
  ]);
});